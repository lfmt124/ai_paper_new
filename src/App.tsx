import { useState } from "react";
import { AgentDrawer } from "./components/AgentDrawer";
import { AppHeader } from "./components/AppHeader";
import { ChatPanel } from "./components/ChatPanel";
import { EvidencePanel } from "./components/EvidencePanel";
import { IdeaBoard } from "./components/IdeaBoard";
import { Sidebar } from "./components/Sidebar";
import { WorkflowStepper } from "./components/WorkflowStepper";
import {
  ideas,
  messages,
  navItems,
  papers,
  projectHistory,
  proposalPreview,
  workflowSteps,
} from "./data/mockData";

export function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar navItems={navItems} projectHistory={projectHistory} />

      <main className="workspace">
        <AppHeader onOpenDrawer={() => setDrawerOpen(true)} />
        <WorkflowStepper steps={workflowSteps} />

        <div className="content-grid">
          <section className="agent-panel">
            <ChatPanel messages={messages} onOpenDrawer={() => setDrawerOpen(true)} />
            <IdeaBoard ideas={ideas} />
          </section>
          <EvidencePanel papers={papers} proposalPreview={proposalPreview} />
        </div>
      </main>

      <AgentDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
