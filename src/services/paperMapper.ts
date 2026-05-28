import type { OpenAlexWork } from "../api/openAlex";
import type { Paper } from "../types";

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

function createContribution(abstract: string): string {
  if (!abstract) {
    return "OpenAlex 暂未提供摘要，后续可接入更多数据源补全。";
  }

  const firstSentence = abstract.match(/[^.!?。！？]+[.!?。！？]/)?.[0] ?? abstract;
  return firstSentence.length > 180 ? `${firstSentence.slice(0, 180)}...` : firstSentence;
}

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
