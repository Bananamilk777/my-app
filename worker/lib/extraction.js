import { BRAND_HINTS, PRODUCT_TERMS, STOP_WORDS, TOPIC_FALLBACKS } from "./catalog.js";
import { normalizeText, uniqueBy } from "./utils.js";

const MODEL_PATTERN = /\b([A-Za-z]{1,6}[-]?\d{2,}[A-Za-z0-9-]{0,})\b/g;

function cleanCandidateText(text) {
  return text
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\[[^\]]+\]|\([^)]+\)|<[^>]+>/g, " ")
    .replace(/[|/,:;]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectBrand(text) {
  return BRAND_HINTS.find((brand) => normalizeText(text).includes(normalizeText(brand))) || "";
}

function extractModelHint(text) {
  const match = text.match(MODEL_PATTERN);
  return match ? match[0] : "";
}

function hasProductSignal(text) {
  const normalized = normalizeText(text);
  return Boolean(
    detectBrand(text) ||
    extractModelHint(text) ||
    PRODUCT_TERMS.some((term) => normalized.includes(normalizeText(term)))
  );
}

function normalizeQuery(rawText) {
  const cleaned = cleanCandidateText(rawText)
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !STOP_WORDS.has(normalizeText(token)))
    .filter((token) => token.length > 1);

  if (!cleaned.length) {
    return "";
  }

  const priorityTokens = cleaned.filter((token) =>
    detectBrand(token) || extractModelHint(token) || PRODUCT_TERMS.some((term) => normalizeText(term) === normalizeText(token))
  );

  const output = [...priorityTokens, ...cleaned.filter((token) => !priorityTokens.includes(token))]
    .slice(0, 6)
    .join(" ")
    .trim();

  return output;
}

function mergeCandidate(store, candidate) {
  const key = candidate.normalizedQuery;
  const existing = store.get(key);
  if (!existing) {
    store.set(key, candidate);
    return;
  }

  existing.confidenceScore = Math.max(existing.confidenceScore, candidate.confidenceScore);
  existing.sources = uniqueBy([...existing.sources, ...candidate.sources], (item) => item);
  existing.evidence.push(candidate.rawText);
}

function addCandidate(store, rawText, source, baseConfidence) {
  const cleaned = cleanCandidateText(rawText);
  if (!cleaned || !hasProductSignal(cleaned)) {
    return;
  }

  const normalizedQuery = normalizeQuery(cleaned);
  if (!normalizedQuery || normalizedQuery.length < 3) {
    return;
  }

  const brand = detectBrand(cleaned);
  const modelHint = extractModelHint(cleaned);
  let confidence = baseConfidence;
  if (brand) confidence += 0.08;
  if (modelHint) confidence += 0.1;
  if (PRODUCT_TERMS.some((term) => normalizeText(cleaned).includes(normalizeText(term)))) confidence += 0.04;

  mergeCandidate(store, {
    rawText: cleaned,
    normalizedQuery,
    confidenceScore: Math.min(confidence, 0.98),
    brand,
    modelHint,
    sources: [source],
    evidence: [cleaned]
  });
}

function extractFromDescription(description, store) {
  description
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      if (line.includes("http")) {
        addCandidate(store, line, "description_link", 0.86);
      }

      const modelMatches = line.match(MODEL_PATTERN) || [];
      modelMatches.forEach((model) => addCandidate(store, `${line} ${model}`, "description_model", 0.82));

      if (line.length < 80) {
        addCandidate(store, line, "description_text", 0.64);
      }
    });
}

function extractFromTitle(title, store) {
  addCandidate(store, title, "title", 0.74);
}

function extractFromTags(tags = [], store) {
  tags.forEach((tag) => addCandidate(store, tag, "tags", 0.58));
}

function extractFromCaptions(captions, store) {
  if (!captions) {
    return;
  }

  const lines = captions
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !/^\d+$/.test(line) && !line.includes("-->"));

  const frequency = new Map();
  lines.forEach((line) => {
    const cleaned = cleanCandidateText(line);
    if (!hasProductSignal(cleaned)) {
      return;
    }

    const normalized = normalizeQuery(cleaned);
    if (!normalized) {
      return;
    }

    frequency.set(normalized, (frequency.get(normalized) || 0) + 1);
  });

  [...frequency.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([query, count]) => addCandidate(store, query, `captions_repeat_${count}`, Math.min(0.52 + count * 0.06, 0.78)));
}

function fallbackQueries(input) {
  const normalized = normalizeText(input);
  const match = TOPIC_FALLBACKS.find((entry) =>
    entry.keys.some((key) => normalized.includes(normalizeText(key)) || normalizeText(key).includes(normalized))
  );

  return match ? match.queries : [];
}

export function extractProductCandidates({ video, inputQuery, captionsText }) {
  const store = new Map();

  extractFromDescription(video.description || "", store);
  extractFromTitle(video.title || "", store);
  extractFromTags(video.tags || [], store);
  extractFromCaptions(captionsText || "", store);

  const candidates = [...store.values()]
    .sort((a, b) => b.confidenceScore - a.confidenceScore)
    .slice(0, 6);

  if (!candidates.length) {
    fallbackQueries(inputQuery).forEach((query) => addCandidate(store, query, "query_fallback", 0.46));
  }

  const finalCandidates = [...store.values()]
    .sort((a, b) => b.confidenceScore - a.confidenceScore)
    .slice(0, 6)
    .map((candidate) => ({
      ...candidate,
      confidenceScore: Number(candidate.confidenceScore.toFixed(2))
    }));

  return {
    extractedCandidates: finalCandidates,
    normalizedQueries: uniqueBy(finalCandidates.map((candidate) => candidate.normalizedQuery), (item) => item)
  };
}
