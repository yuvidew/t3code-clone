"use client";

import { FileText, PanelBottom, PanelRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb";
import { SidebarTrigger, useSidebar } from "@repo/ui/components/sidebar";
import { IconTooltipButton } from "@/components/icon-tooltip-button";

// Right-side view toggles. UI only for now, wired up in the next phase.
const HEADER_ACTIONS = [
  { label: "Summary", icon: FileText },
  { label: "Toggle terminal", icon: PanelBottom },
  { label: "Toggle side panel", icon: PanelRight },
];

// Two-letter initials for the project avatar (e.g. "ai-teams" -> "AT").
const getProjectInitials = (project: string) =>
  project
    .split(/[-_\s]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

/**
 * @component SessionHeader
 * @description Top bar of the main area: project / session title on the left, view toggle icons on the right.
 * @param project Project name shown with its avatar.
 * @param title Current session title.
 */
export const SessionHeader = ({ project, title }: { project: string; title: string }) => {
  const { open, isMobile } = useSidebar();
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex min-w-0 items-center gap-2">
        {/* Only needed here while the sidebar is closed; otherwise the sidebar header holds the trigger. */}
        {(!open || isMobile) && <SidebarTrigger />}
        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem className="text-muted-foreground">
              <Avatar className="size-5 rounded-sm">
                <AvatarFallback className="rounded-sm text-[10px]">
                  {getProjectInitials(project)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{project}</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="truncate font-medium">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-1">
        {HEADER_ACTIONS.map(({ label, icon: Icon }) => (
          <IconTooltipButton key={label} label={label}>
            <Icon />
          </IconTooltipButton>
        ))}
      </div>
    </header>
  );
};
