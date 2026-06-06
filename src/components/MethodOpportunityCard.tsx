import type { EmergingMethodSuggestion } from "../types";

type MethodOpportunityCardProps = {
  method: EmergingMethodSuggestion;
};

// 单个“方法机会”卡片，强调新方法能回答过去答不了的问题。
export function MethodOpportunityCard({ method }: MethodOpportunityCardProps) {
  return (
    <article className="method-opportunity-card">
      <span>{method.label}</span>
      <strong>{method.canAnswer}</strong>
    </article>
  );
}
