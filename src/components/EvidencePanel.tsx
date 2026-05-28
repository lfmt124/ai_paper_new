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

      <PaperSearchControls params={searchParams} isLoading={isLoading} onSearch={onSearch} />
      {error ? <div className="search-error">{error}</div> : null}

      <div className="filter-row">
        <span>
          {searchParams.fromYear}-{searchParams.toYear}
        </span>
        <span>{searchParams.mode}</span>
        <span>{papers[0]?.source || "Mock"}</span>
      </div>

      <div className="paper-list">
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
