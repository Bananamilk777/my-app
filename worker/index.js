import { extractProductCandidates } from "./lib/extraction.js";
import { buildSurfaceProducts, matchProductsForCandidates } from "./lib/matching.js";
import { corsHeaders, json, normalizeText } from "./lib/utils.js";
import { collectVideos, fetchOptionalCaptions } from "./lib/youtube.js";

function buildCandidateSummary(extractedCandidates) {
  if (!extractedCandidates.length) {
    return "영상 설명과 제목에서 뚜렷한 제품 단서를 찾지 못해 관련 상품 중심으로 연결합니다.";
  }

  const top = extractedCandidates[0];
  if (top.confidenceScore >= 0.8) {
    return `설명란 또는 제목에서 "${top.normalizedQuery}" 단서가 뚜렷하게 잡혀 우선 연결했습니다.`;
  }

  if (top.confidenceScore >= 0.62) {
    return `영상 문맥상 "${top.normalizedQuery}" 가능성이 높아 관련 상품을 우선 추천합니다.`;
  }

  return `정확한 모델명보다 문맥이 강한 영상이라 "${top.normalizedQuery}" 관련 상품 위주로 연결합니다.`;
}

function buildVideoCard(video, extractedCandidates, normalizedQueries, matchedProducts, captionsAvailable) {
  const topConfidence = extractedCandidates[0]?.confidenceScore || 0.35;
  const label = topConfidence >= 0.78 ? "높은 가능성" : topConfidence >= 0.62 ? "가능성 높음" : "관련 상품 추천";

  return {
    video,
    extractedCandidates,
    normalizedQueries,
    matchedProducts,
    confidenceScore: topConfidence,
    surfaceLabel: label,
    captionsUsed: captionsAvailable,
    summary: buildCandidateSummary(extractedCandidates)
  };
}

function buildGuideSummary(processedVideos) {
  const strongCount = processedVideos.filter((item) => item.confidenceScore >= 0.78).length;
  if (!processedVideos.length) {
    return "추천 가능한 상품을 찾는 중입니다.";
  }

  if (strongCount >= 1) {
    return "설명란 직접 표기나 모델명 단서가 있는 영상을 우선으로 연결했습니다.";
  }

  return "제목, 설명, 태그, 가능한 경우 자막 단서를 합쳐 관련성이 높은 상품을 추천합니다.";
}

export default {
  async fetch(request, env) {
    const headers = corsHeaders();

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/api/discovery") {
      return json({ ok: false, message: "Not Found" }, { status: 404, headers });
    }

    const input = (url.searchParams.get("q") || "").trim() || "자취 시작템";
    const maxVideos = Math.min(Math.max(Number(url.searchParams.get("maxVideos") || "3"), 1), 5);
    const sort = url.searchParams.get("sort") === "relevance" ? "relevance" : "latest";

    const collected = await collectVideos({ input, maxVideos, sort, env });
    const processedVideos = [];

    for (const video of collected.videos) {
      const captions = await fetchOptionalCaptions(video.id, env);
      const extraction = extractProductCandidates({
        video,
        inputQuery: input,
        captionsText: captions.text
      });

      const candidateMatches = await matchProductsForCandidates({
        extractedCandidates: extraction.extractedCandidates,
        env
      });

      processedVideos.push(
        buildVideoCard(
          video,
          extraction.extractedCandidates,
          extraction.normalizedQueries,
          candidateMatches,
          captions.available
        )
      );
    }

    const products = buildSurfaceProducts(processedVideos.flatMap((item) => item.matchedProducts));
    const hasCaptions = processedVideos.some((item) => item.captionsUsed);

    return json(
      {
        input,
        inputType: collected.mode,
        query: input,
        videos: processedVideos,
        products,
        guideSummary: buildGuideSummary(processedVideos),
        youtubeNote: collected.videos.length
          ? "영상 제목, 설명, 태그를 우선 수집해 상품 후보를 추출했습니다."
          : "관련 영상을 준비 중입니다.",
        shoppingNote: "상품 후보는 쿠팡 연결을 우선 시도하고, 일치도가 낮으면 관련 상품 수준으로 완곡하게 표시합니다.",
        note: hasCaptions
          ? "자막 접근이 가능한 경우 반복 언급 키워드도 함께 반영했습니다."
          : "자막이 없거나 접근이 어려운 경우 제목·설명·태그 중심으로 추천합니다."
      },
      { headers }
    );
  }
};
