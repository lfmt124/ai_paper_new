import type { EmergingMethodSuggestion } from "../types";

const priorityLabel: Record<EmergingMethodSuggestion["priority"], string> = {
  high: "优先",
  medium: "可选",
  low: "备选",
};

type EmergingMethodListProps = {
  methods: EmergingMethodSuggestion[];
};

// 展示可引入的新兴方法。priority 同时控制标签文案和颜色。
export function EmergingMethodList({ methods }: EmergingMethodListProps) {
  return (
    <div className="emerging-method-list">
      {methods.map((method) => (
        <article className={`emerging-method-card ${method.priority}`} key={method.method}>
          <div>
            <strong>{method.label}</strong>
            <span>{priorityLabel[method.priority]}</span>
          </div>
          <p>{method.whyUseful}</p>
          <small>数据要求：{method.dataRequirement}</small>
        </article>
      ))}
    </div>
  );
}
