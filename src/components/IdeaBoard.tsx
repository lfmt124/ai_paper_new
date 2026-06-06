import { Lightbulb } from "lucide-react";
import type { Idea } from "../types";

type IdeaBoardProps = {
  ideas: Idea[];
};

// 候选 idea 总览卡片。第一阶段展示 mock idea，后续可直接接 gapScanAgent 输出。
export function IdeaBoard({ ideas }: IdeaBoardProps) {
  return (
    <section className="idea-section">
      <div className="section-heading">
        <Lightbulb size={20} />
        <h2>候选论文 Idea</h2>
      </div>
      <div className="idea-grid">
        {ideas.map((idea) => (
          <article className="idea-card" key={idea.title}>
            <div className="idea-card-header">
              <h3>{idea.title}</h3>
              <span>{idea.feasibility}%</span>
            </div>
            <p>{idea.value}</p>
            <small>{idea.risk}</small>
            <div className="score-bar" aria-label={`可行性 ${idea.feasibility}%`}>
              <span style={{ width: `${idea.feasibility}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
