"use client";

import { useMemo, useState } from "react";
import {
  ChartNoAxesColumn,
  ChevronRight,
  FolderPlus,
  GitBranch,
  RefreshCw,
  Search,
  Settings,
  SquarePen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@repo/ui/components/sidebar";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@repo/ui/components/input-group";
import { IconTooltipButton } from "@/components/icon-tooltip-button";
import { SessionList } from "@/features/sessions/_components/session-list";
import { ProjectFilter } from "@/features/sessions/_components/project-filter";
import { ALL_PROJECTS, MOCK_SESSIONS, NO_PROJECT } from "@/features/sessions/data";

// Actions shown next to the search bar. UI only for now, wired up in the next phase.
const SEARCH_ACTIONS = [
  { label: "Add project", icon: FolderPlus },
  { label: "New session", icon: SquarePen },
];

// Footer shortcuts. UI only for now.
const FOOTER_ACTIONS = [
  { label: "Settings", icon: Settings },
  { label: "Branches", icon: GitBranch },
  { label: "Usage", icon: ChartNoAxesColumn },
];

/**
 * @component AppSidebar
 * @description Collapsible app sidebar: brand header with toggle, session search, session list, settled count and footer shortcuts.
 */
export const AppSidebar = () => {
  const [query, setQuery] = useState("");
  // Selected project filter (all projects by default).
  const [project, setProject] = useState(ALL_PROJECTS);

  // Sessions in the selected project that also match the search text (title or project).
  const sessions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_SESSIONS.filter((s) => {
      const inProject =
        project === ALL_PROJECTS || (project === NO_PROJECT ? s.project === null : s.project === project);
      const matches =
        !q || s.title.toLowerCase().includes(q) || (s.project ?? "").toLowerCase().includes(q);
      return inProject && matches;
    });
  }, [query, project]);

  const settledCount = MOCK_SESSIONS.filter((s) => s.status === "settled").length;

  return (
    <Sidebar collapsible="offcanvas" className="border-r-0">
      <SidebarHeader className="gap-3">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span className="text-sm font-medium">
            <span className="font-bold">TS</span> Code
          </span>
        </div>
        <div className="flex items-center gap-1">
          <InputGroup className="h-8 border-0 bg-transparent shadow-none">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search sessions"
            />
          </InputGroup>
          <ProjectFilter value={project} onChange={setProject} />
          {SEARCH_ACTIONS.map(({ label, icon: Icon }) => (
            <IconTooltipButton key={label} label={label}>
              <Icon />
            </IconTooltipButton>
          ))}
        </div>
      </SidebarHeader>

      {/* ScrollArea owns the scrolling so the session list gets a themed scrollbar; the block override stops Radix's table wrapper from breaking text truncation. */}
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="min-h-0 flex-1 [&_[data-radix-scroll-area-viewport]>div]:block!">
          <SidebarGroup>
            <SessionList sessions={sessions} />
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="gap-3">
        <button
          type="button"
          className="flex items-center justify-between px-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <span>Settled</span>
          <span className="flex items-center gap-1">
            {settledCount}
            <ChevronRight className="size-4" />
          </span>
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {FOOTER_ACTIONS.map(({ label, icon: Icon }) => (
              <IconTooltipButton key={label} label={label}>
                <Icon />
              </IconTooltipButton>
            ))}
          </div>
          <IconTooltipButton label="Refresh">
            <RefreshCw />
          </IconTooltipButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
