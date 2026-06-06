import type { VariableSupportItem, VariableSupportLevel } from "../types";

const supportLabel: Record<VariableSupportLevel, string> = {
  strong: "强支撑",
  partial: "部分支撑",
  missing: "缺口",
};

type VariableSupportListProps = {
  variables: VariableSupportItem[];
};

// 展示每个变量是否支撑当前 idea，帮助用户看到“能不能测”和“缺什么”。
export function VariableSupportList({ variables }: VariableSupportListProps) {
  return (
    <div className="variable-support-list">
      {variables.map((variable) => (
        // supportLevel 同时控制中文标签和 CSS 颜色。
        <article className={`variable-support-item ${variable.supportLevel}`} key={variable.variableName}>
          <div>
            <strong>{variable.label}</strong>
            <span>{supportLabel[variable.supportLevel]}</span>
          </div>
          <p>{variable.reason}</p>
        </article>
      ))}
    </div>
  );
}
