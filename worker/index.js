const SAMPLE_VIDEOS = [
  {
    id: "sample-ja취-1",
    title: "자취 시작 전에 꼭 사는 생활 필수템 정리",
    description: "원룸 입주 전에 챙기면 좋은 생활용품과 가전 위주로 정리한 영상입니다.",
    channelTitle: "살림가이드",
    publishedAt: "2026-03-12T09:00:00Z",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
  },
  {
    id: "sample-ja취-2",
    title: "2026 자취생 추천템 TOP 10",
    description: "첫 자취생 기준으로 실패 확률이 낮은 아이템만 추렸습니다.",
    channelTitle: "룸셋업 랩",
    publishedAt: "2026-03-09T12:30:00Z",
    thumbnail: "https://i.ytimg.com/vi/oHg5SJYRHA0/hqdefault.jpg"
  },
  {
    id: "sample-ja취-3",
    title: "원룸 입주 첫날 바로 필요한 물건들",
    description: "청소, 수납, 침구, 주방 필수품 중심으로 체크리스트를 제공합니다.",
    channelTitle: "혼삶메모",
    publishedAt: "2026-03-05T07:15:00Z",
    thumbnail: "https://i.ytimg.com/vi/3GwjfUFyY6M/hqdefault.jpg"
  }
];

const PRODUCT_CATALOG = [
  {
    queryKeys: ["자취 시작템", "자취", "원룸 입주"],
    items: [
      {
        id: "starter-kit",
        name: "원룸 생활 스타터 키트",
        category: "생활용품",
        summary: "세제, 청소도구, 빨래망, 욕실 수납 같이 첫 입주에 빠지기 쉬운 항목을 묶은 구성입니다.",
        lowestPriceText: "39,900원",
        priceSourceLabel: "카탈로그 기준 최저가 후보",
        searchTerm: "자취 생활용품 세트",
        videoMentions: ["생활필수", "청소", "욕실수납"],
        affiliateKey: "starter-kit"
      },
      {
        id: "stick-vacuum",
        name: "소형 무선 청소기",
        category: "소형가전",
        summary: "원룸 바닥, 침구, 틈새 관리에 적합한 경량 무선 청소기입니다.",
        lowestPriceText: "67,000원",
        priceSourceLabel: "카탈로그 기준 최저가 후보",
        searchTerm: "원룸 무선 청소기",
        videoMentions: ["청소기", "먼지관리", "원룸가전"],
        affiliateKey: "stick-vacuum"
      },
      {
        id: "slim-rack",
        name: "슬림 이동식 수납 랙",
        category: "수납가구",
        summary: "좁은 주방, 세탁기 옆, 욕실 틈새에 넣기 좋은 3단 수납 랙입니다.",
        lowestPriceText: "29,800원",
        priceSourceLabel: "카탈로그 기준 최저가 후보",
        searchTerm: "틈새 수납 랙",
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
        summary: "헤드보드나 협탁에 클램프 고정해 누운 자세에서도 각도를 맞추기 쉽습니다.",
        lowestPriceText: "31,500원",
        priceSourceLabel: "카탈로그 기준 최저가 후보",
        searchTerm: "침대 태블릿 거치대",
        videoMentions: ["침대시청", "태블릿", "각도조절"],
        affiliateKey: "bed-arm"
      },
      {
        id: "pillow-stand",
        name: "쿠션형 태블릿 스탠드",
        category: "거치대",
        summary: "설치가 필요 없어 침대와 소파를 오가며 쓰기 쉬운 타입입니다.",
        lowestPriceText: "24,900원",
        priceSourceLabel: "카탈로그 기준 최저가 후보",
        searchTerm: "쿠션 태블릿 거치대",
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
        summary: "밝기와 색온도 조절이 가능해 장시간 작업 환경 개선에 적합합니다.",
        lowestPriceText: "44,000원",
        priceSourceLabel: "카탈로그 기준 최저가 후보",
        searchTerm: "데스크 램프 작업등",
        videoMentions: ["조명", "책상", "집중력"],
        affiliateKey: "desk-lamp"
      },
      {
        id: "silent-mouse",
        name: "저소음 무선 마우스",
        category: "입력기기",
        summary: "회의나 야간 작업 시 소음 부담을 줄이는 사무용 마우스입니다.",
        lowestPriceText: "28,000원",
        priceSourceLabel: "카탈로그 기준 최저가 후보",
        searchTerm: "저소음 무선 마우스",
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

function getCatalogItems(query, affiliateLinks) {
  const normalized = normalizeText(query);

  const matched = PRODUCT_CATALOG.find((entry) =>
    entry.queryKeys.some((key) => normalized.includes(normalizeText(key)) || normalizeText(key).includes(normalized))
  );

  const selected = matched ? matched.items : PRODUCT_CATALOG[0].items;

  return selected.map((item) => ({
    ...item,
    searchUrl: `https://www.coupang.com/np/search?q=${encodeURIComponent(item.searchTerm)}`,
    affiliateUrl: affiliateLinks[item.affiliateKey] || ""
  }));
}

async function fetchYoutubeVideos(query, maxVideos, sort, apiKey) {
  const order = sort === "relevance" ? "relevance" : "date";
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    maxResults: String(maxVideos),
    q: query,
    order,
    key: apiKey,
    regionCode: "KR"
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`YouTube API ${response.status}: ${text.slice(0, 160)}`);
  }

  const data = await response.json();
  return (data.items || []).map((item) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "",
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    publishedAtLabel: formatDateLabel(item.snippet.publishedAt)
  }));
}

function getSampleVideos(query, maxVideos) {
  return SAMPLE_VIDEOS.slice(0, maxVideos).map((video) => ({
    ...video,
    title: query === "자취 시작템" ? video.title : `${query} 관련 샘플 영상`,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    publishedAtLabel: formatDateLabel(video.publishedAt)
  }));
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
      let youtubeConnected = false;
      let note = "YouTube API 키가 없어 샘플 영상을 사용 중입니다. 실시간 최신 영상은 환경변수 설정 후 활성화됩니다.";

      try {
        if (env.YOUTUBE_API_KEY) {
          videos = await fetchYoutubeVideos(query, maxVideos, sort, env.YOUTUBE_API_KEY);
          youtubeConnected = true;
          note = "YouTube Data API 기반으로 최신 영상을 조회했습니다. 상품 추천은 주제별 카탈로그 기반이며 실시간 최저가는 별도 쇼핑 API가 필요합니다.";
        } else {
          videos = getSampleVideos(query, maxVideos);
        }
      } catch (error) {
        videos = getSampleVideos(query, maxVideos);
        note = `YouTube API 호출에 실패해 샘플 영상으로 대체했습니다. ${error.message}`;
      }

      const products = getCatalogItems(query, affiliateLinks);

      return json(
        {
          query,
          youtubeConnected,
          note,
          videos,
          products
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
