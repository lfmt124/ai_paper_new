import type { DatasetProfile, FeasibilityCheckResult, NoveltyCheckResult } from "../../types";

// 真实 LLM Agent 接入时可复用这个 Prompt。
// 规则版先给出结构化判断，LLM 可以基于这些字段生成更自然、更细致的导师讨论稿。
export function buildFeasibilityPrompt(
  dataset: DatasetProfile,
  result: FeasibilityCheckResult,
  noveltyResult: NoveltyCheckResult | null,
): string {
  return `你是学术研究设计可行性评估助手。请基于候选 idea 和可用数据判断是否值得推进。

候选 idea：${result.ideaTitle}
数据集：${dataset.name}
样本：${dataset.population}，N=${dataset.sampleSize}
新颖性风险：${noveltyResult?.riskLevel ?? "未验证"}

请评估：
1. 样本覆盖是否匹配研究问题
2. 变量是否足够支撑分析
3. 预期结论是否有可证伪性
4. 需要补充哪些数据
5. 是否可以从现有变量反推更稳妥的研究问题`;
}
