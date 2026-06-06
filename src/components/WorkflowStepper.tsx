import { CheckCircle2 } from "lucide-react";
import type { WorkflowStep } from "../types";

type WorkflowStepperProps = {
  steps: WorkflowStep[];
};

// 6 步工作流进度条。只根据 steps 渲染，不在组件内写死流程文案。
// 修改步骤名称、状态或数量时，优先改 data/mockData.ts 或后端返回数据。
export function WorkflowStepper({ steps }: WorkflowStepperProps) {
  return (
    <section className="workflow-strip" aria-label="工作流步骤">
      {steps.map((step, index) => (
        <article className={`step-card ${step.status}`} key={step.id}>
          <div className="step-index">
            {step.status === "done" ? <CheckCircle2 size={18} /> : index + 1}
          </div>
          <div>
            <h2>{step.label}</h2>
            <p>{step.summary}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
