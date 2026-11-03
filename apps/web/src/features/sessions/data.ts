// Session shape for the sidebar list. Placeholder until the sessions API exists (then move to @repo/shared).
export type Session = {
  id: string;
  title: string;
  project: string;
  age: string;
  status: "running" | "idle" | "settled";
};

// Mock sessions shown in the sidebar for this phase.
export const MOCK_SESSIONS: Session[] = [
  { id: "1", title: "okay run this project", project: "discard-clone", age: "2d", status: "running" },
  { id: "2", title: "add auth middleware to the API", project: "tscode-clone", age: "3d", status: "idle" },
  { id: "3", title: "fix sidebar hydration warning", project: "tscode-clone", age: "5d", status: "settled" },
];
