import type { OpenAlexWork } from "../api/openAlex";
import type { SemanticScholarPaper } from "../api/semanticScholar";
import type { Paper } from "../types";

// OpenAlex 的摘要不是普通字符串，而是“词 -> 位置数组”的倒排索引。
// 页面展示和 Agent 分析前，需要先把它还原成自然语言文本。
function restoreAbstract(index?: Record<string, number[]>): string {
  if (!index) {
    return "";
  }

  const words: string[] = [];

  for (const [word, positions] of Object.entries(index)) {
    for (const position of positions) {
      words[position] = word;
    }
  }

  return words.filter(Boolean).join(" ");
}

// 控制作者展示长度，避免论文卡片被长作者列表撑开。
function formatAuthors(work: OpenAlexWork): string {
  const names =
    work.authorships
      ?.map((authorship) => authorship.author?.display_name)
      .filter((name): name is string => Boolean(name)) ?? [];

  if (names.length === 0) {
    return "Unknown authors";
  }

  if (names.length <= 3) {
    return names.join(", ");
  }

  return `${names.slice(0, 3).join(", ")} et al.`;
}

// 当前 MVP 用摘要第一句当“核心贡献”占位。
// 后续接 LLM 后，可以在 Agent 层生成更准确的贡献总结。
function createContribution(abstract: string): string {
  if (!abstract) {
    return "OpenAlex 暂未提供摘要，后续可接入更多数据源补全。";
  }

  const firstSentence = abstract.match(/[^.!?。！？]+[.!?。！？]/)?.[0] ?? abstract;
  return firstSentence.length > 180 ? `${firstSentence.slice(0, 180)}...` : firstSentence;
}

// 把 OpenAlex 原始数据统一转成项目内部 Paper。
// 这样 UI、Agent、提案生成都只依赖 Paper，而不依赖某个数据源的字段名。
export function mapOpenAlexWorkToPaper(work: OpenAlexWork): Paper {
  const abstract = restoreAbstract(work.abstract_inverted_index);
  const title = work.title || work.display_name || "Untitled paper";
  const venue = work.primary_location?.source?.display_name || "Unknown venue";
  const year = work.publication_year || Number(work.publication_date?.slice(0, 4)) || 0;
  const citedByCount = work.cited_by_count ?? 0;

  return {
    id: work.id,
    title,
    authors: formatAuthors(work),
    year,
    venue,
    type: work.type || "paper",
    contribution: createContribution(abstract),
    evidence: `来自 OpenAlex，当前引用数 ${citedByCount}。可作为后续 Agent 生成贡献和挑战的证据。`,
    abstract,
    citedByCount,
    doi: work.doi,
    url: work.primary_location?.landing_page_url || work.doi || work.id,
    source: "OpenAlex",
  };
}

// Semantic Scholar 的作者字段和 OpenAlex 不同，所以单独格式化。
function formatSemanticScholarAuthors(paper: SemanticScholarPaper): string {
  const names =
    paper.authors?.map((author) => author.name).filter((name): name is string => Boolean(name)) ?? [];

  if (names.length === 0) {
    return "Unknown authors";
  }

  if (names.length <= 3) {
    return names.join(", ");
  }

  return `${names.slice(0, 3).join(", ")} et al.`;
}

// 把 Semantic Scholar 原始数据统一转成项目内部 Paper。
// Semantic Scholar 通常能补充摘要、TLDR、近年论文和开放 PDF 链接。
export function mapSemanticScholarPaperToPaper(paper: SemanticScholarPaper): Paper {
  const title = paper.title || "Untitled paper";
  const abstract = paper.tldr?.text || paper.abstract || "";
  const citedByCount = paper.citationCount ?? 0;
  const doi = paper.externalIds?.DOI ? `https://doi.org/${paper.externalIds.DOI}` : undefined;
  const url = paper.openAccessPdf?.url || paper.url || doi;

  return {
    id: `semantic:${paper.paperId}`,
    title,
    authors: formatSemanticScholarAuthors(paper),
    year: paper.year ?? 0,
    venue: paper.venue || "Unknown venue",
    type: paper.publicationTypes?.[0] || "paper",
    contribution: createContribution(abstract),
    evidence: `来自 Semantic Scholar，当前引用数 ${citedByCount}。适合补充近年论文、摘要和相关性证据。`,
    abstract,
    citedByCount,
    doi,
    url,
    source: "Semantic Scholar",
  };
}
