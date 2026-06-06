import type { DataDrivenIdea } from "../types";

type DataDrivenIdeaListProps = {
  ideas: DataDrivenIdea[];
};

// 从已有数据变量反推更稳妥的问题，适合用户发现原 idea 数据支撑不足时改题。
export function DataDrivenIdeaList({ ideas }: DataDrivenIdeaListProps) {
  return (
    <div className="data-driven-idea-list">
      {ideas.map((idea) => (
        // 这里展示的是“从数据出发”的备选问题，不一定等同于第三步原始 idea。
        <article key={idea.title}>
          <strong>{idea.title}</strong>
          <p>{idea.rationale}</p>
        </article>
      ))}
    </div>
  );
}
