// Two-letter initials for a project avatar (e.g. "ai-teams" -> "AT").
export const getProjectInitials = (project: string) =>
  project
    .split(/[-_\s]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
