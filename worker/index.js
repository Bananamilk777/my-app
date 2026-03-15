const PRODUCT_CATALOG = [
  {
    queryKeys: ["자취 시작템", "자취", "원룸 입주", "자취 필수템"],
    summaryTitle: "첫 자취에서 실패 확률이 낮은 기본 구성을 먼저 비교합니다.",
    items: [
      {
        id: "starter-kit",
        name: "생활 스타터 키트",
        category: "생활용품",
        summary: "세제, 청소도구, 욕실 정리용품처럼 첫 자취에서 빠지기 쉬운 기본 구성을 먼저 보는 용도입니다.",
        searchTerm: "자취 생활용품 세트",
        badges: ["입문자 추천", "기본템", "가성비"],
        reasons: [
          "처음 자취를 시작할 때 빠지는 품목을 한 번에 점검하기 쉽습니다.",
          "브랜드보다 구성 확인이 중요한 입문 단계에 맞는 카테고리입니다.",
          "영상에서 자주 언급되는 생활 기본템 흐름과 잘 맞습니다."
        ],
        beginnerTip: "이미 있는 생필품과 겹치지 않는지 먼저 체크하면 불필요한 지출을 줄일 수 있습니다.",
        videoMentions: ["생활필수", "청소", "욕실수납"],
        affiliateKey: "starter-kit"
      },
      {
        id: "wireless-vacuum",
        name: "소형 무선 청소기",
        category: "소형가전",
        summary: "원룸 바닥과 침구, 틈새 청소를 빠르게 관리하기 쉬운 대표 아이템입니다.",
        searchTerm: "원룸 무선 청소기",
        badges: ["자주 언급됨", "원룸 추천"],
        reasons: [
          "원룸에서는 크고 무거운 청소기보다 꺼내기 쉬운 형태가 유지 사용률이 높습니다.",
          "침구와 틈새 청소까지 함께 다룰 수 있어 체감 효용이 큽니다."
        ],
        beginnerTip: "메인 청소기 용도인지, 보조 청소기 용도인지 구분해서 선택하는 편이 좋습니다.",
        videoMentions: ["청소기", "원룸가전", "먼지관리"],
        affiliateKey: "wireless-vacuum"
      },
      {
        id: "slim-rack",
        name: "슬림 이동식 수납 랙",
        category: "수납가구",
        summary: "좁은 원룸에서 자주 언급되는 틈새 수납 아이템입니다.",
        searchTerm: "틈새 수납 랙",
        badges: ["공간절약", "입문자 추천"],
        reasons: [
          "가구를 많이 늘리지 않고 수납량을 확보하기 좋은 선택지입니다.",
          "주방, 욕실, 세탁기 옆처럼 활용 공간이 넓습니다."
        ],
        beginnerTip: "실측 폭을 먼저 확인하면 실패 확률이 크게 줄어듭니다.",
        videoMentions: ["수납", "좁은공간", "정리"],
        affiliateKey: "slim-rack"
      }
    ]
  },
  {
    queryKeys: ["침대용 아이패드 거치대", "아이패드 거치대", "침대 거치대"],
    summaryTitle: "누워서 볼 때 편한지보다, 실제 고정력과 각도 유지가 더 중요합니다.",
    items: [
      {
        id: "bed-arm",
        name: "침대용 태블릿 암 스탠드",
        category: "거치대",
        summary: "누운 자세에서 태블릿 각도를 안정적으로 맞추기 쉬운 암 타입 거치대입니다.",
        searchTerm: "침대 태블릿 거치대",
        badges: ["고정력 우선", "영상 시청"],
        reasons: [
          "침대용 거치대는 고정력과 흔들림이 만족도를 크게 좌우합니다.",
          "길이 조절이 가능한 암 타입은 시청 자세 변화에 대응하기 좋습니다."
        ],
        beginnerTip: "헤드보드나 협탁 두께와 클램프 호환 범위를 먼저 확인하세요.",
        videoMentions: ["침대시청", "태블릿", "각도조절"],
        affiliateKey: "bed-arm"
      },
      {
        id: "pillow-stand",
        name: "쿠션형 태블릿 스탠드",
        category: "거치대",
        summary: "설치가 필요 없어 침대와 소파를 오가며 쓰기 쉬운 타입입니다.",
        searchTerm: "쿠션 태블릿 거치대",
        badges: ["가볍게 시작", "입문자 추천"],
        reasons: [
          "설치 스트레스가 적어서 처음 거치대를 써보는 사람에게 부담이 적습니다.",
          "이동이 쉬워 침대뿐 아니라 소파, 무릎 위에서도 쓰기 편합니다."
        ],
        beginnerTip: "세밀한 높이 조절보다는 간편함에 강점이 있는 형태입니다.",
        videoMentions: ["무설치", "가벼움", "이동성"],
        affiliateKey: "pillow-stand"
      }
    ]
  },
  {
    queryKeys: ["재택근무 책상 셋업", "재택근무", "책상 셋업"],
    summaryTitle: "비싸게 꾸미는 것보다 오래 써도 피로가 적은 구성이 우선입니다.",
    items: [
      {
        id: "desk-lamp",
        name: "집중형 데스크 램프",
        category: "조명",
        summary: "밝기와 색온도 조절이 가능한 작업등 계열 대표 아이템입니다.",
        searchTerm: "데스크 램프 작업등",
        badges: ["집중 환경", "기본 셋업"],
        reasons: [
          "재택근무 셋업에서는 키보드보다 조명 만족도가 더 즉각적으로 체감되기도 합니다.",
          "밝기와 색온도 조절이 가능하면 시간대별 작업 환경 대응이 쉽습니다."
        ],
        beginnerTip: "책상 너비와 전원 배치를 함께 보고 고르는 편이 좋습니다.",
        videoMentions: ["조명", "책상", "집중력"],
        affiliateKey: "desk-lamp"
      },
      {
        id: "silent-mouse",
        name: "저소음 무선 마우스",
        category: "입력기기",
        summary: "회의나 야간 작업에 무난한 사무용 대표 아이템입니다.",
        searchTerm: "저소음 무선 마우스",
        badges: ["가성비", "사무용"],
        reasons: [
          "재택근무에서는 클릭감보다 소음과 손목 부담이 체감 품질에 영향을 줍니다.",
          "가격 접근성이 좋아 처음 셋업할 때 부담이 적습니다."
        ],
        beginnerTip: "작은 손과 큰 손에 따라 그립감 차이가 커서 치수를 확인하는 편이 좋습니다.",
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

function getCatalogEntry(query) {
  const normalized = normalizeText(query);
  return (
    PRODUCT_CATALOG.find((entry) =>
      entry.queryKeys.some((key) => normalized.includes(normalizeText(key)) || normalizeText(key).includes(normalized))
    ) || PRODUCT_CATALOG[0]
  );
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
  const entry = getCatalogEntry(query);

  const products = await Promise.all(
    entry.items.map(async (item) => {
      try {
        const offers = await fetchNaverShoppingOffers(item.searchTerm, env);
        const firstOffer = offers[0];

        return {
          ...item,
          offers,
          lowestPriceText: firstOffer ? `네이버 쇼핑 기준 ${firstOffer.priceText}` : "실시간 가격 연동 필요",
          priceSourceLabel: firstOffer ? "실시간 가격 후보" : "가격 정보 준비 중",
          searchUrl: `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(item.searchTerm)}`,
          affiliateUrl: affiliateLinks[item.affiliateKey] || ""
        };
      } catch {
        return {
          ...item,
          offers: [],
          lowestPriceText: "실시간 가격 연동 필요",
          priceSourceLabel: "가격 정보 준비 중",
          searchUrl: `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(item.searchTerm)}`,
          affiliateUrl: affiliateLinks[item.affiliateKey] || ""
        };
      }
    })
  );

  return {
    summaryTitle: entry.summaryTitle,
    products
  };
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
      let youtubeNote = "YouTube API 키가 연결되지 않아 영상을 불러오지 못했습니다.";
      let shoppingNote = "네이버 쇼핑 API 키가 없어서 실시간 가격 비교는 비활성화되어 있습니다.";
      let note = "서비스 흐름은 영상 참고 이후 가격 비교로 이어지도록 구성했습니다.";

      if (env.YOUTUBE_API_KEY) {
        try {
          videos = await fetchYoutubeVideos(query, maxVideos, sort, env.YOUTUBE_API_KEY);
          youtubeNote = "외부 재생이 가능한 최신 유튜브 영상만 보여줍니다.";
        } catch (error) {
          youtubeNote = `유튜브 영상을 불러오지 못했습니다. ${error.message}`;
        }
      }

      const productResult = await buildProductResults(query, env, affiliateLinks);
      if (env.NAVER_CLIENT_ID && env.NAVER_CLIENT_SECRET) {
        shoppingNote = "네이버 쇼핑 검색 API 기준으로 낮은 가격 후보부터 비교합니다.";
      }

      return json(
        {
          query,
          videos,
          products: productResult.products,
          guideSummary: productResult.summaryTitle,
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
