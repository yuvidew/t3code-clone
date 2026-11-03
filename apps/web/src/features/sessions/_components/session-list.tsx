import { Asterisk } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@repo/ui/components/sidebar";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@repo/ui/components/empty";
import type { Session } from "../data";

/**
 * @component SessionList
 * @description Lists sessions (project, age, title, status icon) in the sidebar, with an empty state.
 * @param sessions Already-filtered sessions to render.
 */
export const SessionList = ({ sessions }: { sessions: Session[] }) => {
  if (sessions.length === 0) {
    return (
      <Empty className="border-0 p-2">
        <EmptyHeader>
          <EmptyTitle>No sessions</EmptyTitle>
          <EmptyDescription>Nothing matches your search.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  return (
    <SidebarMenu>
      {sessions.map((session) => (
        <SidebarMenuItem key={session.id}>
          <SidebarMenuButton className="h-auto flex-col items-stretch gap-0.5 py-2">
            <span className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate">{session.project}</span>
              <span>{session.age}</span>
            </span>
            <span className="flex items-center justify-between gap-2">
              <span className="truncate">{session.title}</span>
              {session.status === "running" && <Asterisk className="size-4 shrink-0 text-primary" />}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
