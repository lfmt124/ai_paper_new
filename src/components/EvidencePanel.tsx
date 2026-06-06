import { BookOpen, ClipboardList } from "lucide-react";
import type { Paper, PaperSearchParams } from "../types";
import { PaperSearchControls } from "./PaperSearchControls";

type EvidencePanelProps = {
  papers: Paper[];
  proposalPreview: string;
  searchParams: PaperSearchParams;
  isLoading: boolean;
  error: string | null;
  onSearch: (params: PaperSearchParams) => void;
};

// 论文证据面板：展示检索控件、检索结果和提案预览。
// 这里只负责渲染和把检索参数传出去，真实请求逻辑在 usePaperSearch/service 层。
export function EvidencePanel({
  papers,
  proposalPreview,
  searchParams,
  isLoading,
  error,
  onSearch,
}: EvidencePanelProps) {
  return (
    <aside className="evidence-panel">
      <div className="section-heading">
        <BookOpen size={20} />
        <h2>论文证据面板</h2>
      </div>

      {/* 检索控件独立成组件；证据面板只负责把当前状态和回调传进去。 */}
      <PaperSearchControls params={searchParams} isLoading={isLoading} onSearch={onSearch} />
      {error ? <div className="search-error">{error}</div> : null}

      {/* 当前检索条件摘要，帮助用户理解右侧论文列表来自哪个范围和数据源。 */}
      <div className="filter-row">
        <span>
          {searchParams.fromYear}-{searchParams.toYear}
        </span>
        <span>{searchParams.mode}</span>
        <span>{searchParams.source}</span>
      </div>

      <div className="paper-list">
        {/* Paper 是统一后的内部数据结构，所以这里不需要判断来自 OpenAlex 还是 Semantic Scholar。 */}
        {papers.map((paper) => (
          <article className="paper-card" key={paper.id}>
            <div className="paper-meta">
              <span>{paper.year}</span>
              <span>{paper.venue}</span>
              <span>{paper.type}</span>
              {typeof paper.citedByCount === "number" ? <span>{paper.citedByCount} citations</span> : null}
            </div>
            <h3>{paper.title}</h3>
            <p className="authors">{paper.authors}</p>
            <p>{paper.contribution}</p>
            <div className="evidence-note">
              <ClipboardList size={16} />
              {paper.evidence}
            </div>
            {paper.url ? (
              <a className="paper-link" href={paper.url} target="_blank" rel="noreferrer">
                查看来源
              </a>
            ) : null}
          </article>
        ))}
      </div>

      <section className="proposal-preview">
        <p className="eyebrow">Proposal Draft</p>
        <h2>300 字提案预览</h2>
        <p>{proposalPreview}</p>
      </section>
    </aside>
  );
}
