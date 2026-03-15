import { extractYoutubeVideoId, formatDateLabel } from "./utils.js";

async function fetchJson(url, init = {}) {
  const response = await fetch(url, init);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text.slice(0, 180)}`);
  }

  return response.json();
}

function mapVideoItem(item) {
  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description || "",
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    publishedAtLabel: formatDateLabel(item.snippet.publishedAt),
    tags: item.snippet.tags || [],
    url: `https://www.youtube.com/watch?v=${item.id}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${item.id}`
  };
}

async function fetchVideoDetails(videoIds, apiKey) {
  const params = new URLSearchParams({
    part: "snippet",
    id: videoIds.join(","),
    key: apiKey
  });

  const data = await fetchJson(`https://www.googleapis.com/youtube/v3/videos?${params.toString()}`);
  return (data.items || []).map(mapVideoItem);
}

export async function collectVideos({ input, maxVideos, sort, env }) {
  if (!env.YOUTUBE_API_KEY) {
    return {
      mode: extractYoutubeVideoId(input) ? "video_url" : "keyword",
      videos: [],
      note: "실시간 영상을 준비 중입니다."
    };
  }

  const directVideoId = extractYoutubeVideoId(input);
  if (directVideoId) {
    const videos = await fetchVideoDetails([directVideoId], env.YOUTUBE_API_KEY);
    return {
      mode: "video_url",
      videos,
      note: "입력한 영상에서 상품 후보를 추출하고 있습니다."
    };
  }

  const order = sort === "relevance" ? "relevance" : "date";
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    q: input,
    maxResults: String(maxVideos),
    order,
    regionCode: "KR",
    relevanceLanguage: "ko",
    safeSearch: "moderate",
    videoEmbeddable: "true",
    videoSyndicated: "true",
    key: env.YOUTUBE_API_KEY
  });

  const searchData = await fetchJson(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
  const videoIds = (searchData.items || [])
    .map((item) => item.id && item.id.videoId)
    .filter(Boolean);

  if (!videoIds.length) {
    return {
      mode: "keyword",
      videos: [],
      note: "관련 영상을 찾는 중입니다."
    };
  }

  const videos = await fetchVideoDetails(videoIds, env.YOUTUBE_API_KEY);
  return {
    mode: "keyword",
    videos,
    note: "최신 영상 흐름을 먼저 정리하고 있습니다."
  };
}

export async function fetchOptionalCaptions(videoId, env) {
  if (!env.YOUTUBE_OAUTH_ACCESS_TOKEN) {
    return { text: "", available: false };
  }

  try {
    const params = new URLSearchParams({
      part: "snippet",
      videoId
    });

    const captionList = await fetchJson(`https://www.googleapis.com/youtube/v3/captions?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${env.YOUTUBE_OAUTH_ACCESS_TOKEN}`
      }
    });

    const firstCaption = (captionList.items || [])[0];
    if (!firstCaption) {
      return { text: "", available: false };
    }

    const response = await fetch(`https://www.googleapis.com/youtube/v3/captions/${firstCaption.id}?tfmt=srt`, {
      headers: {
        Authorization: `Bearer ${env.YOUTUBE_OAUTH_ACCESS_TOKEN}`
      }
    });

    if (!response.ok) {
      return { text: "", available: false };
    }

    return {
      text: await response.text(),
      available: true
    };
  } catch {
    return { text: "", available: false };
  }
}
