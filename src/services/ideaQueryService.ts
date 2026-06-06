import type { NoveltyQuerySet } from "../types";

// 去掉中英文引号，避免把展示文案中的标点带进检索式。
function normalizeIdeaTitle(title: string): string {
  return title.replace(/[“”"']/g, "").trim();
}

// 把候选 idea 转成三类检索式：
// relatedQueries 查相似研究，reviewQueries 查综述，latestQueries 查近年进展。
export function createNoveltyQueries(ideaTitle: string): NoveltyQuerySet {
  const normalizedTitle = normalizeIdeaTitle(ideaTitle);

  // 对当前 mock/规则 Agent 生成的重点 idea 做定制关键词，检索效果比直接用中文标题更稳定。
  if (normalizedTitle.includes("提示词素养")) {
    return {
      ideaTitle,
      relatedQueries: [
        "prompt literacy AI feedback adoption",
        "prompt literacy academic writing revision",
        "LLM feedback uptake graduate students",
      ],
      reviewQueries: [
        "AI writing feedback review",
        "ChatGPT academic writing systematic review",
      ],
      latestQueries: [
        "prompt literacy LLM writing feedback",
        "ChatGPT writing feedback revision behavior",
      ],
    };
  }

  // 第二类重点 idea 也给一组定制英文检索式，方便 OpenAlex 和 Semantic Scholar 命中。
  if (normalizedTitle.includes("导师反馈")) {
    return {
      ideaTitle,
      relatedQueries: [
        "AI feedback teacher feedback academic writing",
        "LLM feedback instructor feedback writing revision",
        "human AI feedback academic writing",
      ],
      reviewQueries: [
        "AI feedback academic writing review",
        "automated writing feedback systematic review",
      ],
      latestQueries: [
        "generative AI teacher feedback writing",
        "ChatGPT instructor feedback academic writing",
      ],
    };
  }

  // 兜底策略：未知 idea 直接基于标题扩展检索式，保证功能不会因为新 idea 中断。
  return {
    ideaTitle,
    relatedQueries: [
      normalizedTitle,
      `${normalizedTitle} academic writing`,
      `${normalizedTitle} graduate students`,
    ],
    reviewQueries: [`${normalizedTitle} review`, `${normalizedTitle} systematic review`],
    latestQueries: [`${normalizedTitle} 2025`, `${normalizedTitle} 2026`],
  };
}
