import { rankPapersForGapScan, pickEvidencePaperIds } from "../services/paperRankingService";
import type { GapScanResult, Paper } from "../types";
import { buildGapScanPrompt } from "./prompts/gapScanPrompt";

// 把排序后的论文裁剪成第三步面板需要展示的“关键论文”结构。
// 注意这里不改变原始 Paper，只提取扫描结果要用的字段。
function buildKeyPapers(papers: Paper[]) {
  return papers.slice(0, 6).map((paper) => ({
    paperId: paper.id,
    title: paper.title,
    year: paper.year,
    venue: paper.venue,
    contribution: paper.contribution,
  }));
}

// 第三步 Agent 入口。
// 当前是确定性规则版：用论文排序结果 + 固定挑战/idea 模板生成结构化结果。
// 后续接真实 LLM 时，可以保留函数签名，把中间逻辑替换成：
// buildGapScanPrompt -> 调模型 -> 解析 JSON -> 返回 GapScanResult。
export function runGapScanAgent(topic: string, papers: Paper[]): GapScanResult {
  const rankedPapers = rankPapersForGapScan(papers);
  const evidenceIds = pickEvidencePaperIds(rankedPapers, 3);

  // Keep the prompt builder in place so this deterministic agent can be swapped for a real LLM call.
  void buildGapScanPrompt(topic, rankedPapers);

  return {
    topic,
    keyPapers: buildKeyPapers(rankedPapers),
    // 这些挑战是 MVP 阶段的规则模板，用于先跑通“方向 -> 空白 -> idea”的产品体验。
    // 真实 Agent 版本应让模型基于 rankedPapers 动态生成挑战，并保留 evidencePaperIds。
    challenges: [
      {
        title: "长期学习效果证据不足",
        description:
          "现有研究更多关注工具接受度、短期表现和课堂体验，仍缺少跨学期追踪来判断 AI 反馈是否真正改善学术写作能力。",
        evidencePaperIds: evidenceIds,
      },
      {
        title: "真实写作过程数据仍稀缺",
        description:
          "不少论文依赖问卷或访谈，较少结合多轮草稿、反馈日志和修改轨迹，因此难以解释学生如何把 AI 建议转化为论文修改。",
        evidencePaperIds: evidenceIds,
      },
      {
        title: "学生能力差异没有被充分建模",
        description:
          "提示词素养、研究经验和反馈判断能力可能影响 AI 反馈采纳，但这些变量尚未形成稳定的解释框架。",
        evidencePaperIds: evidenceIds,
      },
    ],
    // 候选 idea 同样先用模板，第四步会基于这些 idea 做新颖性验证。
    ideas: [
      {
        title: "提示词素养如何影响 AI 反馈采纳",
        rationale:
          "把写作反馈理论放到 LLM 辅助写作情境中，检验学生提出问题、解释反馈和执行修改之间的关系。",
        noveltyRisk: "已有 prompt literacy 研究，需要限定到研究生论文写作和反馈采纳过程。",
        evidencePaperIds: evidenceIds,
      },
      {
        title: "AI 反馈与导师反馈的互补机制",
        rationale:
          "比较不同反馈来源对修改深度、写作信心和研究自主性的影响，适合用课堂或导师组真实过程数据验证。",
        noveltyRisk: "相关议题较成熟，创新点应放在反馈组合机制和真实修改轨迹。",
        evidencePaperIds: evidenceIds,
      },
      {
        title: "基于修改轨迹预测学术写作成长",
        rationale:
          "利用多版本文本差异、反馈采纳路径和最终评分，探索 AI 时代写作成长的过程性指标。",
        noveltyRisk: "方法门槛较高，需要足够完整的文本版本和反馈日志。",
        evidencePaperIds: evidenceIds,
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}
