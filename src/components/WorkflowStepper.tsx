import { CheckCircle2 } from "lucide-react";
import type { WorkflowStep } from "../types";

type WorkflowStepperProps = {
  steps: WorkflowStep[];
};

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
