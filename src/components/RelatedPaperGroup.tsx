import type { Paper } from "../types";

type RelatedPaperGroupProps = {
  title: string;
  papers: Paper[];
};

// 第四步的论文证据小组，可以复用于相似研究、综述论文和近年进展。
// 这里只展示摘要信息，完整论文数据仍然保存在 Paper 类型里，后续可加展开详情。
export function RelatedPaperGroup({ title, papers }: RelatedPaperGroupProps) {
  return (
    <section className="related-paper-group">
      <h3>{title}</h3>
      {papers.length === 0 ? (
        <p className="empty-note">当前检索式没有返回可用论文。</p>
      ) : (
        <div className="related-paper-list">
          {papers.map((paper) => (
            <article key={paper.id}>
              <div>
                <span>{paper.year}</span>
                <span>{paper.source}</span>
                {typeof paper.citedByCount === "number" ? <span>{paper.citedByCount} citations</span> : null}
              </div>
              <strong>{paper.title}</strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
