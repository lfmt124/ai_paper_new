import type { PaperSearchParams } from "../types";

// Semantic Scholar paper/search 返回的原始论文结构。
// 这里只保留本项目需要展示或传给 Agent 的字段。
export type SemanticScholarPaper = {
  paperId: string;
  title?: string;
  abstract?: string;
  year?: number;
  venue?: string;
  url?: string;
  citationCount?: number;
  publicationTypes?: string[];
  externalIds?: {
    DOI?: string;
    ArXiv?: string;
    PubMed?: string;
  };
  openAccessPdf?: {
    url?: string;
  };
  tldr?: {
    text?: string;
  };
  authors?: Array<{
    name?: string;
  }>;
};

export type SemanticScholarSearchResponse = {
  total?: number;
  offset?: number;
  next?: number;
  data?: SemanticScholarPaper[];
};

// 开发环境走 Vite proxy，避免浏览器 CORS 问题。
// 生产环境如果仍由前端直连，会走官方 API；后续更推荐由自己的后端代理。
const SEMANTIC_SCHOLAR_BASE_URL = import.meta.env.DEV
  ? "/semantic-scholar/graph/v1"
  : "https://api.semanticscholar.org/graph/v1";

// 明确请求字段能减少响应体大小，也方便维护 mapper。
const FIELDS = [
  "title",
  "abstract",
  "year",
  "venue",
  "url",
  "citationCount",
  "authors",
  "externalIds",
  "publicationTypes",
  "openAccessPdf",
  "tldr",
].join(",");

// Semantic Scholar 请求入口。
// 无 API key 也能试用，但容易 429；配置 VITE_SEMANTIC_SCHOLAR_API_KEY 可提升限额。
export async function fetchSemanticScholarPapers(
  params: PaperSearchParams,
  signal?: AbortSignal,
): Promise<SemanticScholarSearchResponse> {
  const url = new URL(`${SEMANTIC_SCHOLAR_BASE_URL}/paper/search`, window.location.origin);
  const query = params.mode === "review" ? `${params.query} review` : params.query;

  url.searchParams.set("query", query);
  url.searchParams.set("limit", String(params.perPage));
  url.searchParams.set("year", `${params.fromYear}-${params.toYear}`);
  url.searchParams.set("fields", FIELDS);

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  const apiKey = import.meta.env.VITE_SEMANTIC_SCHOLAR_API_KEY;
  if (apiKey) {
    // 官方推荐的 API key 请求头。
    headers["x-api-key"] = apiKey;
  }

  const response = await fetch(url, { headers, signal });

  if (!response.ok) {
    throw new Error(`Semantic Scholar request failed: ${response.status}`);
  }

  return response.json() as Promise<SemanticScholarSearchResponse>;
}
