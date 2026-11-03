// Session shape for the sidebar list. Placeholder until the sessions API exists (then move to @repo/shared).
export type Session = {
  id: string;
  title: string;
  // Project name, or null for sessions that belong to no project.
  project: string | null;
  age: string;
  status: "running" | "idle" | "settled";
};

// Filter value meaning "show every project".
export const ALL_PROJECTS = "__all__";
// Filter value meaning "sessions without a project".
export const NO_PROJECT = "__none__";

// Mock projects offered by the sidebar filter.
export const MOCK_PROJECTS = ["ai-teams", "discard-clone", "hp"];

// Mock sessions shown in the sidebar for this phase.
export const MOCK_SESSIONS: Session[] = [
  { id: "1", title: "okay run this project", project: "discard-clone", age: "2d", status: "running" },
  { id: "2", title: "add auth middleware to the API", project: "ai-teams", age: "3d", status: "idle" },
  { id: "3", title: "fix sidebar hydration warning", project: "hp", age: "5d", status: "settled" },
  { id: "4", title: "plan the sessions API", project: null, age: "6d", status: "idle" },
  { id: "5", title: "build the agents list page", project: "ai-teams", age: "1d", status: "running" },
  { id: "6", title: "write tests for the chat service", project: "ai-teams", age: "4d", status: "settled" },
  { id: "7", title: "migrate styles to tailwind v4", project: "discard-clone", age: "1w", status: "settled" },
  { id: "8", title: "set up the dashboard layout", project: "hp", age: "2w", status: "idle" },
  { id: "9", title: "scratch notes for next sprint", project: null, age: "3w", status: "settled" },
];
