import type { DatasetProfile } from "../types";

// 一个很轻量的关键词匹配工具，先解决 MVP 阶段的“是否大致相关”。
function includesAny(text: string, keywords: string[]): boolean {
  const normalized = text.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

// 判断数据集覆盖的人群和场景是否贴近当前 idea。
// 当前是规则版，后续可替换为 LLM 对 idea 与数据集描述的匹配评分。
export function assessDatasetCoverage(ideaTitle: string, dataset: DatasetProfile) {
  const evidenceText = `${ideaTitle} ${dataset.name} ${dataset.population} ${dataset.dataSources.join(" ")}`;
  const hasGraduateSample = includesAny(evidenceText, ["研究生", "硕", "博", "graduate"]);
  const hasWritingContext = includesAny(evidenceText, ["写作", "writing", "论文"]);
  const hasFeedbackTrace = includesAny(evidenceText, ["反馈", "修改", "revision", "批注"]);

  // 分数不是统计模型，只是产品原型里的启发式评分：人群、场景、过程证据分别加分。
  const score = 52 + (hasGraduateSample ? 16 : 0) + (hasWritingContext ? 16 : 0) + (hasFeedbackTrace ? 12 : 0);

  return {
    score: Math.min(score, 96),
    summary: hasGraduateSample && hasWritingContext
      ? `该数据集覆盖${dataset.population}，且包含学术写作场景，适合验证当前 idea 的核心人群与任务。`
      : `该数据集与当前 idea 有一定关联，但人群或写作场景覆盖不够精准，需要在研究问题中收窄边界。`,
  };
}
