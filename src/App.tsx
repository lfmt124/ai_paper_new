import { useState } from "react";
import { AgentDrawer } from "./components/AgentDrawer";
import { AppHeader } from "./components/AppHeader";
import { ChatPanel } from "./components/ChatPanel";
import { EvidencePanel } from "./components/EvidencePanel";
import { IdeaBoard } from "./components/IdeaBoard";
import { Sidebar } from "./components/Sidebar";
import { WorkflowStepper } from "./components/WorkflowStepper";
import {
  initialPaperSearchParams,
  ideas,
  messages,
  navItems,
  papers,
  projectHistory,
  proposalPreview,
  workflowSteps,
} from "./data/mockData";
import { usePaperSearch } from "./hooks/usePaperSearch";

export function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const paperSearch = usePaperSearch({
    initialPapers: papers,
    initialParams: initialPaperSearchParams,
    autoSearch: true,
  });

  return (
    <div className="app-shell">
      <Sidebar navItems={navItems} projectHistory={projectHistory} />

      <main className="workspace">
        <AppHeader onOpenDrawer={() => setDrawerOpen(true)} />
        <WorkflowStepper steps={workflowSteps} />

        <div className="content-grid">
          <section className="agent-panel">
            <ChatPanel
              messages={messages}
              searchParams={paperSearch.params}
              onOpenDrawer={() => setDrawerOpen(true)}
            />
            <IdeaBoard ideas={ideas} />
          </section>
          <EvidencePanel
            papers={paperSearch.papers}
            proposalPreview={proposalPreview}
            searchParams={paperSearch.params}
            isLoading={paperSearch.isLoading}
            error={paperSearch.error}
            onSearch={paperSearch.runSearch}
          />
        </div>
      </main>

      <AgentDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
