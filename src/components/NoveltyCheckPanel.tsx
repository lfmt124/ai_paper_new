import { ShieldCheck } from "lucide-react";
import type { GapScanIdea, NoveltyCheckResult } from "../types";
import { IdeaSelector } from "./IdeaSelector";
import { NoveltyRiskBadge } from "./NoveltyRiskBadge";
import { RelatedPaperGroup } from "./RelatedPaperGroup";

type NoveltyCheckPanelProps = {
  ideas: GapScanIdea[];
  selectedIdeaTitle: string;
  result: NoveltyCheckResult | null;
  isLoading: boolean;
  error: string | null;
  onSelectIdea: (ideaTitle: string) => void;
  onRunCheck: () => void;
};

// 第四步主面板：负责组织 idea 选择、验证按钮、风险概览、调整建议和论文证据分组。
// 具体检索和评分逻辑都在 useNoveltyCheck / noveltyAgent 中，组件只消费结果。
export function NoveltyCheckPanel({
  ideas,
  selectedIdeaTitle,
  result,
  isLoading,
  error,
  onSelectIdea,
  onRunCheck,
}: NoveltyCheckPanelProps) {
  return (
    <section className="novelty-section">
      <div className="section-heading">
        <ShieldCheck size={20} />
        <h2>Idea 新颖性验证</h2>
      </div>

      <IdeaSelector ideas={ideas} selectedIdeaTitle={selectedIdeaTitle} onSelect={onSelectIdea} />

      <div className="novelty-actions">
        <button type="button" onClick={onRunCheck} disabled={isLoading}>
          {isLoading ? "验证中" : "重新验证当前 Idea"}
        </button>
        {error ? <span>{error}</span> : null}
      </div>

      {result ? (
        <>
          {/* 概览区让用户先快速判断这个 idea 是高风险还是仍有探索空间。 */}
          <div className="novelty-overview">
            <div>
              <span>新颖性风险</span>
              <NoveltyRiskBadge riskLevel={result.riskLevel} />
            </div>
            <div>
              <span>可行性分数</span>
              <strong>{result.feasibilityScore}%</strong>
            </div>
            <div>
              <span>检索式</span>
              <strong>{result.queries.relatedQueries.length + result.queries.reviewQueries.length + result.queries.latestQueries.length} 组</strong>
            </div>
          </div>

          <p className="novelty-summary">{result.noveltySummary}</p>

          {/* 调整建议来自规则评分服务，后续也可以改为 LLM 生成。 */}
          <div className="suggestion-list">
            {result.adjustmentSuggestions.map((suggestion) => (
              <span key={suggestion}>{suggestion}</span>
            ))}
          </div>

          {/* 三组论文分别对应：查重相似性、方向成熟度、近年是否仍有新进展。 */}
          <div className="related-paper-grid">
            <RelatedPaperGroup title="相似研究" papers={result.similarPapers} />
            <RelatedPaperGroup title="综述论文" papers={result.reviewPapers} />
            <RelatedPaperGroup title="近年进展" papers={result.latestPapers} />
          </div>
        </>
      ) : (
        <p className="empty-note">选择一个候选 idea 后，系统会检索相似研究、综述和近年进展。</p>
      )}
    </section>
  );
}
