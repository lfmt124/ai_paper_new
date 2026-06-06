import { fetchOpenAlexWorks } from "../api/openAlex";
import { fetchSemanticScholarPapers } from "../api/semanticScholar";
import type { Paper, PaperSearchParams } from "../types";
import { mapOpenAlexWorkToPaper, mapSemanticScholarPaperToPaper } from "./paperMapper";

// 多源检索会返回重复论文。优先用 DOI 去重，没有 DOI 时用标题兜底。
function dedupePapers(papers: Paper[]): Paper[] {
  const seen = new Set<string>();
  const deduped: Paper[] = [];

  for (const paper of papers) {
    const key = (paper.doi || paper.title).toLowerCase().replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(paper);
  }

  return deduped;
}

// 排序规则与检索模式保持一致：
// latest 看年份，trends/review 默认看引用数。
function sortPapers(papers: Paper[], params: PaperSearchParams): Paper[] {
  if (params.mode === "latest") {
    return [...papers].sort((a, b) => b.year - a.year || (b.citedByCount ?? 0) - (a.citedByCount ?? 0));
  }

  return [...papers].sort((a, b) => (b.citedByCount ?? 0) - (a.citedByCount ?? 0) || b.year - a.year);
}

// 单独封装每个数据源，方便以后加 Crossref / arXiv / PubMed。
async function searchOpenAlex(params: PaperSearchParams, signal?: AbortSignal): Promise<Paper[]> {
  const response = await fetchOpenAlexWorks(params, signal);
  return response.results.map(mapOpenAlexWorkToPaper);
}

async function searchSemanticScholar(params: PaperSearchParams, signal?: AbortSignal): Promise<Paper[]> {
  const response = await fetchSemanticScholarPapers(params, signal);
  return (response.data ?? []).map(mapSemanticScholarPaperToPaper);
}

// 论文检索统一入口。
// UI 和 Agent 都应该调用这个函数，而不是直接依赖某个外部 API。
export async function searchPapers(
  params: PaperSearchParams,
  signal?: AbortSignal,
): Promise<Paper[]> {
  if (params.source === "openalex") {
    return searchOpenAlex(params, signal);
  }

  if (params.source === "semanticScholar") {
    return searchSemanticScholar(params, signal);
  }

  // combined 模式允许某个数据源失败而不拖垮整个检索。
  // 例如 Semantic Scholar 无 key 时可能 429，OpenAlex 仍可返回结果。
  const results = await Promise.allSettled([
    searchSemanticScholar(params, signal),
    searchOpenAlex(params, signal),
  ]);

  // 合并、去重、排序后只保留当前页面需要的数量。
  const papers = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  return sortPapers(dedupePapers(papers), params).slice(0, params.perPage);
}
