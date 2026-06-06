import type { GapScanIdea } from "../types";

type IdeaSelectorProps = {
  ideas: GapScanIdea[];
  selectedIdeaTitle: string;
  onSelect: (ideaTitle: string) => void;
};

// 展示第三步生成的候选 idea，让用户决定第四步要验证哪一个。
// 这里使用 title 作为选择值，因为当前规则版 idea 标题是唯一的。
export function IdeaSelector({ ideas, selectedIdeaTitle, onSelect }: IdeaSelectorProps) {
  return (
    <div className="idea-selector">
      {ideas.map((idea) => (
        <button
          className={idea.title === selectedIdeaTitle ? "selected" : ""}
          key={idea.title}
          type="button"
          onClick={() => onSelect(idea.title)}
        >
          <strong>{idea.title}</strong>
          <span>{idea.noveltyRisk}</span>
        </button>
      ))}
    </div>
  );
}
