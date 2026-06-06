import type { KeyPaperInsight } from "../types";

type KeyPaperListProps = {
  papers: KeyPaperInsight[];
};

// 第三步结果中的“关键论文”列表：只负责展示 Agent 已经整理好的论文贡献。
// 论文排序和贡献摘要在 agent/service 层完成，组件里不要再写筛选或排序逻辑。
export function KeyPaperList({ papers }: KeyPaperListProps) {
  return (
    <div className="key-paper-list">
      {papers.map((paper) => (
        <article className="key-paper-item" key={paper.paperId}>
          <div>
            <span>{paper.year}</span>
            <span>{paper.venue}</span>
          </div>
          <strong>{paper.title}</strong>
          <p>{paper.contribution}</p>
        </article>
      ))}
    </div>
  );
}
