import { BRAND_HINTS, PRODUCT_TERMS } from "./catalog.js";
import { formatWon, normalizeText, stripHtmlTags, uniqueBy } from "./utils.js";

function buildAffiliateUrl(productUrl, env) {
  if (!productUrl) {
    return "";
  }

  if (env.COUPANG_AFFILIATE_TEMPLATE && productUrl.includes("coupang.com")) {
    return env.COUPANG_AFFILIATE_TEMPLATE.replace("{{URL}}", encodeURIComponent(productUrl));
  }

  return productUrl;
}

function detectBrand(text) {
  return BRAND_HINTS.find((brand) => normalizeText(text).includes(normalizeText(brand))) || "";
}

function extractModelParts(text) {
  return (text.match(/[A-Za-z0-9-]{4,}/g) || []).map((part) => normalizeText(part));
}

function tokenOverlap(a, b) {
  const aTokens = new Set(normalizeText(a).split(/\s+/).filter(Boolean));
  const bTokens = new Set(normalizeText(b).split(/\s+/).filter(Boolean));
  let count = 0;
  aTokens.forEach((token) => {
    if (bTokens.has(token)) {
      count += 1;
    }
  });
  return count;
}

async function fetchNaverCandidates(query, env) {
  if (!env.NAVER_CLIENT_ID || !env.NAVER_CLIENT_SECRET) {
    return [];
  }

  const params = new URLSearchParams({
    query,
    display: "8",
    sort: "sim",
    exclude: "used:rental:cbshop"
  });

  const response = await fetch(`https://openapi.naver.com/v1/search/shop.json?${params.toString()}`, {
    headers: {
      "X-Naver-Client-Id": env.NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": env.NAVER_CLIENT_SECRET
    }
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return (data.items || []).map((item) => ({
    title: stripHtmlTags(item.title),
    mallName: item.mallName || "판매처 정보 없음",
    link: item.link || "",
    price: Number(item.lprice || 0),
    priceText: item.lprice ? formatWon(item.lprice) : "가격 정보 없음",
    brand: item.brand || "",
    maker: item.maker || "",
    productType: item.productType || ""
  }));
}

function scoreCandidate(candidate, extractedCandidate) {
  const modelParts = extractModelParts(extractedCandidate.rawText);
  const titleNormalized = normalizeText(candidate.title);
  const queryNormalized = normalizeText(extractedCandidate.normalizedQuery);
  const brand = extractedCandidate.brand || detectBrand(extractedCandidate.rawText);

  let score = 0;
  let matchReason = [];

  const overlap = tokenOverlap(candidate.title, extractedCandidate.normalizedQuery);
  score += overlap * 12;
  if (overlap > 0) {
    matchReason.push("검색어 핵심 단어가 상품명과 겹칩니다.");
  }

  if (brand && normalizeText(candidate.title).includes(normalizeText(brand))) {
    score += 24;
    matchReason.push("브랜드명이 일치합니다.");
  }

  if (modelParts.some((part) => titleNormalized.includes(part))) {
    score += 28;
    matchReason.push("모델명 또는 규격 단서가 겹칩니다.");
  }

  if (PRODUCT_TERMS.some((term) => queryNormalized.includes(normalizeText(term)) && titleNormalized.includes(normalizeText(term)))) {
    score += 14;
    matchReason.push("카테고리 적합도가 높습니다.");
  }

  if (candidate.mallName.includes("쿠팡") || candidate.link.includes("coupang.com")) {
    score += 18;
    matchReason.push("쿠팡 내 상품 후보로 연결 가능합니다.");
  }

  if (candidate.price > 0) {
    score += Math.max(0, 18 - Math.min(candidate.price / 20000, 18));
  }

  const confidenceScore = Number(Math.min(0.99, extractedCandidate.confidenceScore * 0.6 + score / 140).toFixed(2));
  return {
    ...candidate,
    score,
    confidenceScore,
    matchReason: uniqueBy(matchReason, (item) => item)
  };
}

function bucketizeCandidates(candidates) {
  if (!candidates.length) {
    return [];
  }

  const sortedByPrice = [...candidates].filter((item) => item.price > 0).sort((a, b) => a.price - b.price);
  const sortedByScore = [...candidates].sort((a, b) => b.score - a.score);
  const cheapest = sortedByPrice[0] || sortedByScore[0];
  const bestFit = sortedByScore[0];
  const valuePick = [...sortedByScore]
    .sort((a, b) => (b.score / Math.max(b.price || 1, 1)) - (a.score / Math.max(a.price || 1, 1)))[0] || bestFit;

  const mapped = [];

  if (cheapest) {
    mapped.push({ ...cheapest, bucketLabel: "쿠팡 내 최저 후보" });
  }

  if (valuePick && valuePick.link !== cheapest.link) {
    mapped.push({ ...valuePick, bucketLabel: "가성비 후보" });
  }

  if (bestFit && !mapped.some((item) => item.link === bestFit.link)) {
    mapped.push({ ...bestFit, bucketLabel: "문맥상 가장 가까운 후보" });
  }

  return mapped.slice(0, 3);
}

function createSearchFallback(query, extractedCandidate, env) {
  const coupangSearchUrl = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(query)}`;
  return [{
    title: query,
    mallName: "쿠팡 검색 결과",
    link: coupangSearchUrl,
    price: 0,
    priceText: "가격은 상세 페이지에서 확인",
    confidenceScore: Number(Math.max(0.4, extractedCandidate.confidenceScore - 0.15).toFixed(2)),
    bucketLabel: "관련 상품 후보",
    matchReason: ["정확한 상품 일치도가 낮아 관련 검색 결과로 연결합니다."],
    affiliateUrl: buildAffiliateUrl(coupangSearchUrl, env)
  }];
}

export async function matchProductsForCandidates({ extractedCandidates, env }) {
  const results = [];

  for (const candidate of extractedCandidates.slice(0, 4)) {
    const fetched = await fetchNaverCandidates(candidate.normalizedQuery, env);
    const coupangFirst = fetched.filter((item) => item.mallName.includes("쿠팡") || item.link.includes("coupang.com"));
    const sourceCandidates = coupangFirst.length ? coupangFirst : fetched;

    const ranked = sourceCandidates
      .map((item) => scoreCandidate(item, candidate))
      .sort((a, b) => b.score - a.score);

    const selected = ranked.length ? bucketizeCandidates(ranked) : createSearchFallback(candidate.normalizedQuery, candidate, env);

    results.push({
      rawCandidate: candidate.rawText,
      normalizedQuery: candidate.normalizedQuery,
      confidenceScore: candidate.confidenceScore,
      matchedProducts: selected.map((item) => ({
        productName: item.title,
        mallName: item.mallName,
        priceText: item.priceText,
        link: item.link,
        affiliateUrl: item.affiliateUrl || buildAffiliateUrl(item.link, env),
        confidenceScore: item.confidenceScore,
        bucketLabel: item.bucketLabel,
        matchReason: item.matchReason,
        isLowConfidence: item.confidenceScore < 0.62
      }))
    });
  }

  return results;
}

export function buildSurfaceProducts(videoMatches) {
  const flattened = videoMatches.flatMap((entry) =>
    entry.matchedProducts.map((product) => ({
      name: product.productName,
      summary: `${entry.normalizedQuery} 관련 후보로 연결했습니다.`,
      badges: [product.bucketLabel, entry.confidenceScore >= 0.72 ? "자동 추천" : "관련 상품"],
      reasons: product.matchReason,
      beginnerTip: product.isLowConfidence
        ? "정확한 모델명은 상세 페이지에서 다시 확인하는 편이 안전합니다."
        : "영상 문맥과 상품명 단서를 함께 반영해 자동 연결했습니다.",
      videoMentions: [entry.normalizedQuery],
      category: "자동 추출 결과",
      priceSourceLabel: product.bucketLabel,
      lowestPriceText: product.priceText,
      offers: [{
        mallName: product.mallName,
        title: product.productName,
        priceText: product.priceText,
        link: product.link
      }],
      searchUrl: product.link,
      affiliateUrl: product.affiliateUrl,
      confidenceScore: product.confidenceScore
    }))
  );

  return uniqueBy(flattened, (item) => `${item.name}:${item.searchUrl}`)
    .sort((a, b) => b.confidenceScore - a.confidenceScore)
    .slice(0, 6);
}
