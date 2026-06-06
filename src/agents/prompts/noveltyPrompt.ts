import type { NoveltyCheckResult } from "../../types";

// 真实 LLM Agent 接入时可复用这个 Prompt。
// 现在规则版已经算出了结果，这里先把结果整理成 LLM 可以继续润色/审稿的上下文。
export function buildNoveltyPrompt(result: NoveltyCheckResult): string {
  return `你是学术选题新颖性验证助手。请基于检索结果评估 idea：“${result.ideaTitle}”。

请注意：
1. 不能说“绝对没人做过”
2. 只能根据当前检索结果判断新颖性风险
3. 必须给出可操作的题目调整建议

当前规则版结果：
- 风险等级：${result.riskLevel}
- 可行性分数：${result.feasibilityScore}
- 相似论文：${result.similarPapers.length} 篇
- 综述论文：${result.reviewPapers.length} 篇
- 最新进展：${result.latestPapers.length} 篇`;
}
