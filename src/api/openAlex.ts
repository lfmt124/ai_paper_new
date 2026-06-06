import type { PaperSearchParams } from "../types";

// OpenAlex /works 接口返回的原始论文结构。
// 这里只声明本项目实际会用到的字段，避免把整份 API schema 带进前端。
export type OpenAlexWork = {
  id: string;
  title?: string;
  display_name?: string;
  publication_year?: number;
  publication_date?: string;
  doi?: string;
  cited_by_count?: number;
  type?: string;
  abstract_inverted_index?: Record<string, number[]>;
  primary_location?: {
    landing_page_url?: string;
    source?: {
      display_name?: string;
    };
  };
  authorships?: Array<{
    author?: {
      display_name?: string;
    };
  }>;
};

export type OpenAlexWorksResponse = {
  results: OpenAlexWork[];
  meta?: {
    count?: number;
    per_page?: number;
    page?: number;
  };
};

const OPEN_ALEX_WORKS_URL = "https://api.openalex.org/works";

// 第二步的 OpenAlex 请求入口。
// 组件不要直接调用它，应通过 services/paperSearchService.ts 统一检索。
export async function fetchOpenAlexWorks(
  params: PaperSearchParams,
  signal?: AbortSignal,
): Promise<OpenAlexWorksResponse> {
  const url = new URL(OPEN_ALEX_WORKS_URL);
  // 综述模式会自动追加 review，提高检索到综述/系统综述的概率。
  const query = params.mode === "review" ? `${params.query} review` : params.query;
  const sort = params.mode === "latest" ? "publication_date:desc" : "cited_by_count:desc";
  const normalizedQuery = query.replace(/,/g, " ").trim();

  url.searchParams.set("sort", sort);
  url.searchParams.set("per-page", String(params.perPage));
  url.searchParams.set(
    "filter",
    [
      // 用标题+摘要检索比普通 search 更适合主题相关性，能减少偏题论文。
      `title_and_abstract.search:${normalizedQuery}`,
      `from_publication_date:${params.fromYear}-01-01`,
      `to_publication_date:${params.toYear}-12-31`,
    ].join(","),
  );

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`OpenAlex request failed: ${response.status}`);
  }

  // 保持返回 OpenAlex 原始结构，后续由 mapper 统一转成项目内部 Paper。
  return response.json() as Promise<OpenAlexWorksResponse>;
}
