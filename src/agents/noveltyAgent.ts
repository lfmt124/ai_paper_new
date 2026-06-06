import { searchPapers } from "../services/paperSearchService";
import { createNoveltyQueries } from "../services/ideaQueryService";
import {
  scoreFeasibility,
  scoreNoveltyRisk,
  suggestAdjustments,
  summarizeNovelty,
} from "../services/noveltyScoringService";
import type { NoveltyCheckResult, Paper, PaperSearchParams } from "../types";
import { buildNoveltyPrompt } from "./prompts/noveltyPrompt";

// 多个数据源可能返回同一篇论文。这里优先用 DOI 去重，没有 DOI 时退回标题。
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

// 从检索式里抽出核心关键词，用于做一次轻量相关性过滤。
// 这是为了减少 OpenAlex / Semantic Scholar 返回“年份相关但主题偏远”的论文。
function extractKeywords(queries: string[]): string[] {
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "students",
    "graduate",
    "academic",
    "review",
    "systematic",
  ]);

  return Array.from(
    new Set(
      queries
        .join(" ")
        .toLowerCase()
        .split(/\W+/)
        .filter((word) => word.length >= 3 && !stopWords.has(word)),
    ),
  );
}

// 当前版本先用标题、摘要和贡献字段判断相关性。
// 后续如果接 embedding 或 reranker，可以把这个函数替换成语义相关性打分。
function filterRelevantPapers(papers: Paper[], queries: string[]): Paper[] {
  const keywords = extractKeywords(queries);

  return papers.filter((paper) => {
    const searchable = `${paper.title} ${paper.abstract ?? ""} ${paper.contribution}`.toLowerCase();
    const matched = keywords.filter((keyword) => searchable.includes(keyword));
    return matched.length >= 2;
  });
}

// 同一类问题会生成多组检索式，例如相似研究、综述、近年进展。
// 这里统一执行并合并结果，避免 Novelty Agent 主流程里堆请求细节。
async function searchQueryGroup(
  queries: string[],
  params: PaperSearchParams,
  overrides: Partial<PaperSearchParams>,
  signal?: AbortSignal,
): Promise<Paper[]> {
  const results = await Promise.allSettled(
    queries.map((query) =>
      searchPapers(
        {
          ...params,
          ...overrides,
          query,
          perPage: 4,
        },
        signal,
      ),
    ),
  );

  return filterRelevantPapers(
    dedupePapers(results.flatMap((result) => (result.status === "fulfilled" ? result.value : []))),
    queries,
  );
}

// 第四步的主流程：围绕一个候选 idea 检索证据，再给出风险、可行性和调整建议。
// 这个函数就是以后接真实学术 Agent 时最重要的替换点之一。
export async function runNoveltyAgent(
  ideaTitle: string,
  params: PaperSearchParams,
  signal?: AbortSignal,
): Promise<NoveltyCheckResult> {
  const queries = createNoveltyQueries(ideaTitle);
  // “近年进展”默认只看当前检索范围的最后两年，模拟用户说的 2025/2026 最新验证思路。
  const latestStartYear = Math.max(params.toYear - 1, params.fromYear);

  // 三类检索互不依赖，所以并行跑，减少等待时间。
  const [similarPapers, reviewPapers, latestPapers] = await Promise.all([
    searchQueryGroup(queries.relatedQueries, params, { mode: "trends" }, signal),
    searchQueryGroup(queries.reviewQueries, params, { mode: "review" }, signal),
    searchQueryGroup(
      queries.latestQueries,
      params,
      {
        mode: "latest",
        fromYear: latestStartYear,
        toYear: params.toYear,
      },
      signal,
    ),
  ]);

  const riskLevel = scoreNoveltyRisk(similarPapers, reviewPapers);
  const feasibilityScore = scoreFeasibility(riskLevel, latestPapers);
  // 返回给 UI 的数据保持结构化，组件只负责展示，不直接参与判断。
  const result: NoveltyCheckResult = {
    ideaTitle,
    queries,
    similarPapers: similarPapers.slice(0, 6),
    reviewPapers: reviewPapers.slice(0, 4),
    latestPapers: latestPapers.slice(0, 4),
    riskLevel,
    feasibilityScore,
    noveltySummary: summarizeNovelty(riskLevel, similarPapers.length, reviewPapers.length),
    adjustmentSuggestions: suggestAdjustments(riskLevel),
  };

  // Keep the prompt builder ready for a future LLM-backed version of the same agent contract.
  void buildNoveltyPrompt(result);

  return result;
}
