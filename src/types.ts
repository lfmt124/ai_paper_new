import type { LucideIcon } from "lucide-react";

export type WorkflowStatus = "done" | "active" | "next";

export type WorkflowStep = {
  id: string;
  label: string;
  summary: string;
  status: WorkflowStatus;
};

export type Paper = {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  type: string;
  contribution: string;
  evidence: string;
  abstract?: string;
  citedByCount?: number;
  doi?: string;
  url?: string;
  source?: string;
};

export type PaperSearchMode = "trends" | "latest" | "review";

export type PaperSearchParams = {
  query: string;
  fromYear: number;
  toYear: number;
  mode: PaperSearchMode;
  perPage: number;
};

export type Idea = {
  title: string;
  value: string;
  risk: string;
  feasibility: number;
};

export type AgentMessage = {
  role: "user" | "assistant";
  text: string;
};

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
};
