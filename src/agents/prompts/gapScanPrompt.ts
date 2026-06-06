import type { Paper } from "../../types";

// 第三步真实 LLM 版本会使用这个 prompt。
// 现在规则版 Agent 还没有真正调用模型，但先把 prompt 结构放好，方便以后替换。
export function buildGapScanPrompt(topic: string, papers: Paper[]): string {
  // 只取前 10 篇，避免一次传给模型的上下文过长。
  // 优先使用真实摘要；没有摘要时用 mapper 生成的 contribution 兜底。
  const paperContext = papers
    .slice(0, 10)
    .map(
      (paper, index) =>
        `${index + 1}. ${paper.title} (${paper.year}, ${paper.venue})\n摘要: ${
          paper.abstract || paper.contribution
        }`,
    )
    .join("\n\n");

  // 要求模型“只基于论文证据”输出，减少凭空编造研究空白的风险。
  return `你是学术选题助手。请只基于以下论文证据，为研究主题“${topic}”做研究空白扫描。

要求输出：
1. 重要论文及核心贡献
2. 仍未解决的主要挑战
3. 2-3 个可行论文 idea
4. 每个判断必须对应论文证据

论文证据：
${paperContext}`;
}
