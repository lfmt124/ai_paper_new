import type { MethodLimitation } from "../types";

type MethodLimitationListProps = {
  limitations: MethodLimitation[];
};

// 展示传统/常见方法的局限，帮助用户理解“为什么要换一种方法”。
export function MethodLimitationList({ limitations }: MethodLimitationListProps) {
  return (
    <div className="method-limitation-list">
      {limitations.map((item) => (
        <article key={item.method}>
          <strong>{item.label}</strong>
          <p>{item.limitation}</p>
        </article>
      ))}
    </div>
  );
}
