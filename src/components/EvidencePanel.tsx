import { BookOpen, ClipboardList } from "lucide-react";
import type { Paper } from "../types";

type EvidencePanelProps = {
  papers: Paper[];
  proposalPreview: string;
};

export function EvidencePanel({ papers, proposalPreview }: EvidencePanelProps) {
  return (
    <aside className="evidence-panel">
      <div className="section-heading">
        <BookOpen size={20} />
        <h2>论文证据面板</h2>
      </div>
      <div className="filter-row">
        <span>2024-2026</span>
        <span>review</span>
        <span>latest</span>
      </div>

      <div className="paper-list">
        {papers.map((paper) => (
          <article className="paper-card" key={paper.id}>
            <div className="paper-meta">
              <span>{paper.year}</span>
              <span>{paper.venue}</span>
              <span>{paper.type}</span>
            </div>
            <h3>{paper.title}</h3>
            <p className="authors">{paper.authors}</p>
            <p>{paper.contribution}</p>
            <div className="evidence-note">
              <ClipboardList size={16} />
              {paper.evidence}
            </div>
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
