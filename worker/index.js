const PRODUCT_CATALOG = [
  {
    queryKeys: ["자취 시작템", "자취", "원룸 입주", "자취 필수템"],
    items: [
      {
        id: "starter-kit",
        name: "생활 스타터 키트",
        category: "생활용품",
        summary: "첫 자취에서 빠지기 쉬운 세제, 청소도구, 욕실 정리용품처럼 기본 구성을 먼저 보는 용도입니다.",
        searchTerm: "자취 생활용품 세트",
        fallbackPriceText: "가격 API 연결 전",
        fallbackPriceSourceLabel: "실시간 가격 연동 필요",
        videoMentions: ["생활필수", "청소", "욕실수납"],
        affiliateKey: "starter-kit"
      },
      {
        id: "wireless-vacuum",
        name: "소형 무선 청소기",
        category: "소형가전",
        summary: "원룸 바닥과 침구, 틈새 청소를 빠르게 관리하기 쉬운 대표 아이템입니다.",
        searchTerm: "원룸 무선 청소기",
        fallbackPriceText: "가격 API 연결 전",
        fallbackPriceSourceLabel: "실시간 가격 연동 필요",
        videoMentions: ["청소기", "원룸가전", "먼지관리"],
        affiliateKey: "wireless-vacuum"
      },
      {
        id: "slim-rack",
        name: "슬림 이동식 수납 랙",
        category: "수납가구",
        summary: "좁은 원룸에서 자주 언급되는 틈새 수납 아이템입니다.",
        searchTerm: "틈새 수납 랙",
        fallbackPriceText: "가격 API 연결 전",
        fallbackPriceSourceLabel: "실시간 가격 연동 필요",
        videoMentions: ["수납", "좁은공간", "정리"],
        affiliateKey: "slim-rack"
      }
    ]
  },
  {
    queryKeys: ["침대용 아이패드 거치대", "아이패드 거치대", "침대 거치대"],
    items: [
      {
        id: "bed-arm",
        name: "침대용 태블릿 암 스탠드",
        category: "거치대",
        summary: "누운 자세에서 태블릿 각도를 맞추기 쉬운 암 타입 거치대입니다.",
        searchTerm: "침대 태블릿 거치대",
        fallbackPriceText: "가격 API 연결 전",
        fallbackPriceSourceLabel: "실시간 가격 연동 필요",
        videoMentions: ["침대시청", "태블릿", "각도조절"],
        affiliateKey: "bed-arm"
      },
      {
        id: "pillow-stand",
        name: "쿠션형 태블릿 스탠드",
        category: "거치대",
        summary: "설치가 필요 없어 침대와 소파를 오가며 쓰기 쉬운 타입입니다.",
        searchTerm: "쿠션 태블릿 거치대",
        fallbackPriceText: "가격 API 연결 전",
        fallbackPriceSourceLabel: "실시간 가격 연동 필요",
        videoMentions: ["무설치", "가벼움", "이동성"],
        affiliateKey: "pillow-stand"
      }
    ]
  },
  {
    queryKeys: ["재택근무 책상 셋업", "재택근무", "책상 셋업"],
    items: [
      {
        id: "desk-lamp",
        name: "집중형 데스크 램프",
        category: "조명",
        summary: "밝기와 색온도 조절이 가능한 작업등 계열 대표 아이템입니다.",
        searchTerm: "데스크 램프 작업등",
        fallbackPriceText: "가격 API 연결 전",
        fallbackPriceSourceLabel: "실시간 가격 연동 필요",
        videoMentions: ["조명", "책상", "집중력"],
        affiliateKey: "desk-lamp"
      },
      {
        id: "silent-mouse",
        name: "저소음 무선 마우스",
        category: "입력기기",
        summary: "회의나 야간 작업에 무난한 사무용 대표 아이템입니다.",
        searchTerm: "저소음 무선 마우스",
        fallbackPriceText: "가격 API 연결 전",
        fallbackPriceSourceLabel: "실시간 가격 연동 필요",
        videoMentions: ["저소음", "사무용", "무선"],
        affiliateKey: "silent-mouse"
      }
    ]
  }
];

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...init.headers
    },
    ...init
  });
}

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}

function normalizeText(text) {
  return text.trim().toLowerCase();
}

function formatDateLabel(value) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

function formatWon(price) {
  return `${Number(price).toLocaleString("ko-KR")}원`;
}

function stripHtmlTags(value) {
  return value.replace(/<[^>]+>/g, "").trim();
}

function parseAffiliateLinks(raw) {
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function getCatalogItems(query) {
  const normalized = normalizeText(query);
  const matched = PRODUCT_CATALOG.find((entry) =>
    entry.queryKeys.some((key) => normalized.includes(normalizeText(key)) || normalizeText(key).includes(normalized))
  );

  return (matched || PRODUCT_CATALOG[0]).items;
}

async function fetchYoutubeVideos(query, maxVideos, sort, apiKey) {
  const order = sort === "relevance" ? "relevance" : "date";
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    q: query,
    maxResults: String(maxVideos),
    order,
    regionCode: "KR",
    relevanceLanguage: "ko",
    safeSearch: "moderate",
    videoEmbeddable: "true",
    videoSyndicated: "true",
    key: apiKey
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`YouTube API ${response.status}: ${text.slice(0, 180)}`);
  }

  const data = await response.json();
  return (data.items || []).map((item) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    publishedAtLabel: formatDateLabel(item.snippet.publishedAt),
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${item.id.videoId}`
  }));
}

async function fetchNaverShoppingOffers(searchTerm, env) {
  if (!env.NAVER_CLIENT_ID || !env.NAVER_CLIENT_SECRET) {
    return [];
  }

  const params = new URLSearchParams({
    query: searchTerm,
    display: "5",
    sort: "asc",
    exclude: "used:rental:cbshop"
  });

  const response = await fetch(`https://openapi.naver.com/v1/search/shop.json?${params.toString()}`, {
    headers: {
      "X-Naver-Client-Id": env.NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": env.NAVER_CLIENT_SECRET
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Naver Shopping API ${response.status}: ${text.slice(0, 180)}`);
  }

  const data = await response.json();
  return (data.items || []).slice(0, 3).map((item) => ({
    title: stripHtmlTags(item.title),
    mallName: item.mallName || "판매처 정보 없음",
    priceText: item.lprice ? formatWon(item.lprice) : "가격 정보 없음",
    link: item.link,
    brand: item.brand || "",
    maker: item.maker || ""
  }));
}

async function buildProductResults(query, env, affiliateLinks) {
  const items = getCatalogItems(query);

  return Promise.all(
    items.map(async (item) => {
      try {
        const offers = await fetchNaverShoppingOffers(item.searchTerm, env);
        const firstOffer = offers[0];

        return {
          ...item,
          offers,
          lowestPriceText: firstOffer ? `네이버 쇼핑 기준 ${firstOffer.priceText}` : item.fallbackPriceText,
          priceSourceLabel: firstOffer ? "실시간 가격 후보" : item.fallbackPriceSourceLabel,
          searchUrl: `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(item.searchTerm)}`,
          affiliateUrl: affiliateLinks[item.affiliateKey] || ""
        };
      } catch {
        return {
          ...item,
          offers: [],
          lowestPriceText: item.fallbackPriceText,
          priceSourceLabel: item.fallbackPriceSourceLabel,
          searchUrl: `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(item.searchTerm)}`,
          affiliateUrl: affiliateLinks[item.affiliateKey] || ""
        };
      }
    })
  );
}

export default {
  async fetch(request, env) {
    const headers = corsHeaders();

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    const url = new URL(request.url);

    if (url.pathname === "/api/discovery") {
      const query = (url.searchParams.get("q") || "").trim() || "자취 시작템";
      const maxVideos = Math.min(Math.max(Number(url.searchParams.get("maxVideos") || "5"), 3), 5);
      const sort = url.searchParams.get("sort") === "relevance" ? "relevance" : "latest";
      const affiliateLinks = parseAffiliateLinks(env.COUPANG_AFFILIATE_LINKS_JSON);

      let videos = [];
      let youtubeNote = "YouTube API 키가 연결되지 않아 영상 목록을 불러오지 못했습니다.";
      let shoppingNote = "네이버 쇼핑 API 키가 연결되지 않아 실시간 최저가 비교가 비활성화되어 있습니다.";
      let note = "영상과 가격 비교를 모두 실제 API로 연결할 수 있게 구조를 구성했습니다.";

      if (env.YOUTUBE_API_KEY) {
        try {
          videos = await fetchYoutubeVideos(query, maxVideos, sort, env.YOUTUBE_API_KEY);
          youtubeNote = "외부 재생이 가능한 최신 유튜브 영상만 표시합니다.";
        } catch (error) {
          youtubeNote = `유튜브 영상을 불러오지 못했습니다. ${error.message}`;
        }
      }

      const products = await buildProductResults(query, env, affiliateLinks);
      if (env.NAVER_CLIENT_ID && env.NAVER_CLIENT_SECRET) {
        shoppingNote = "네이버 쇼핑 검색 API 기준으로 가장 낮은 가격 후보부터 보여줍니다.";
      }

      return json(
        {
          query,
          videos,
          products,
          youtubeNote,
          shoppingNote,
          note
        },
        { headers }
      );
    }

    return json(
      {
        ok: false,
        message: "Not Found"
      },
      {
        status: 404,
        headers
      }
    );
  }
};
