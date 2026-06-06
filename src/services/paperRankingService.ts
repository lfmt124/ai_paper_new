import type { Paper } from "../types";

// 第三步给研究空白扫描挑选证据论文。
// 当前规则：先过滤掉缺标题/年份的结果，再优先按引用数排序，引用数相同时看年份。
export function rankPapersForGapScan(papers: Paper[]): Paper[] {
  return [...papers]
    .filter((paper) => paper.title && paper.year)
    .sort((a, b) => {
      const citationDelta = (b.citedByCount ?? 0) - (a.citedByCount ?? 0);
      if (citationDelta !== 0) {
        return citationDelta;
      }

      return b.year - a.year;
    });
}

// 为挑战和 idea 绑定论文证据 id。
// 后续如果要在 UI 中点击挑战高亮对应论文，可以从这些 id 反查 Paper。
export function pickEvidencePaperIds(papers: Paper[], count = 2): string[] {
  return papers.slice(0, count).map((paper) => paper.id);
}
