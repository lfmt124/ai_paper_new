import type { NoveltyRiskLevel, Paper } from "../types";

// 综述/调查类论文通常说明方向已经比较成熟，所以单独计数参与风险判断。
function countReviewPapers(papers: Paper[]): number {
  return papers.filter((paper) => {
    const searchable = `${paper.title} ${paper.type}`.toLowerCase();
    return searchable.includes("review") || searchable.includes("survey");
  }).length;
}

// 当前是规则版新颖性评分：相似研究越多、综述越多，风险越高。
// 后续可以替换成 LLM 结合摘要做更细的“是否真的同题”判断。
export function scoreNoveltyRisk(similarPapers: Paper[], reviewPapers: Paper[]): NoveltyRiskLevel {
  const reviewCount = countReviewPapers(reviewPapers);

  if (similarPapers.length >= 8 || reviewCount >= 2) {
    return "high";
  }

  if (similarPapers.length >= 4 || reviewCount === 1) {
    return "medium";
  }

  return "low";
}

// 可行性不是纯新颖性：近年仍有论文说明方向活跃，所以会给一点加分。
export function scoreFeasibility(riskLevel: NoveltyRiskLevel, latestPapers: Paper[]): number {
  const base = riskLevel === "low" ? 82 : riskLevel === "medium" ? 74 : 61;
  const latestBonus = Math.min(latestPapers.length * 2, 8);
  return Math.min(base + latestBonus, 90);
}

// 给用户看的自然语言总结。这里只总结检索证据，不下“绝对没人做过”的结论。
export function summarizeNovelty(riskLevel: NoveltyRiskLevel, similarCount: number, reviewCount: number): string {
  if (riskLevel === "high") {
    return `当前检索到 ${similarCount} 篇相关研究和 ${reviewCount} 篇综述/综述类论文，说明方向较成熟。建议缩小场景、变量或数据来源后再推进。`;
  }

  if (riskLevel === "medium") {
    return `当前已有一定相关研究，但尚未完全覆盖该 idea。更稳妥的做法是把创新点放在特定人群、真实过程数据或变量机制上。`;
  }

  return `当前检索到的高度相似研究较少，方向存在可探索空间。仍需继续扩大数据库和关键词验证，不能直接判断为绝对新颖。`;
}

// 根据风险等级给出不同的题目收窄/调整建议。
export function suggestAdjustments(riskLevel: NoveltyRiskLevel): string[] {
  if (riskLevel === "high") {
    return [
      "把研究对象缩小到硕博生论文写作或开题写作场景。",
      "加入可测变量，例如提示词素养、反馈判断能力或修改深度。",
      "改用真实修改轨迹、反馈日志或访谈材料形成数据差异。",
    ];
  }

  if (riskLevel === "medium") {
    return [
      "优先选择一个明确理论框架，避免 idea 只停留在工具效果比较。",
      "用 review 论文定位成熟结论，再寻找未被覆盖的人群或情境。",
      "把题目从“大范围影响”收窄到一个可测量机制。",
    ];
  }

  return [
    "继续用近两年论文验证是否出现快速跟进研究。",
    "保留当前 idea，但在提案里明确新情境、新数据或新方法。",
    "准备一组替代关键词，避免只因检索词过窄造成假新颖。",
  ];
}
