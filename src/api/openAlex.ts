import type { PaperSearchParams } from "../types";

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

export async function fetchOpenAlexWorks(
  params: PaperSearchParams,
  signal?: AbortSignal,
): Promise<OpenAlexWorksResponse> {
  const url = new URL(OPEN_ALEX_WORKS_URL);
  const query = params.mode === "review" ? `${params.query} review` : params.query;
  const sort = params.mode === "latest" ? "publication_date:desc" : "cited_by_count:desc";
  const normalizedQuery = query.replace(/,/g, " ").trim();

  url.searchParams.set("sort", sort);
  url.searchParams.set("per-page", String(params.perPage));
  url.searchParams.set(
    "filter",
    [
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

  return response.json() as Promise<OpenAlexWorksResponse>;
}
