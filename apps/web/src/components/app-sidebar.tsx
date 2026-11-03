"use client";

import { useMemo, useState } from "react";
import {
  ChartNoAxesColumn,
  ChevronRight,
  FolderPlus,
  GitBranch,
  ListFilter,
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
import { InputGroup, InputGroupAddon, InputGroupInput } from "@repo/ui/components/input-group";
import { IconTooltipButton } from "@/components/icon-tooltip-button";
import { SessionList } from "@/features/sessions/_components/session-list";
import { MOCK_SESSIONS } from "@/features/sessions/data";

// Actions shown next to the search bar. UI only for now, wired up in the next phase.
const SEARCH_ACTIONS = [
  { label: "Filter", icon: ListFilter },
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

  // Sessions matching the search text (title or project).
  const sessions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_SESSIONS.filter(
      (s) => !q || s.title.toLowerCase().includes(q) || s.project.toLowerCase().includes(q),
    );
  }, [query]);

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
          {SEARCH_ACTIONS.map(({ label, icon: Icon }) => (
            <IconTooltipButton key={label} label={label}>
              <Icon />
            </IconTooltipButton>
          ))}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SessionList sessions={sessions} />
        </SidebarGroup>
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
