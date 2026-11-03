"use client";

import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@repo/ui/components/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

// Shows a trigger in the main area only while the sidebar is closed, so it can be reopened.
const ReopenTrigger = () => {
  const { open, isMobile } = useSidebar();
  if (open && !isMobile) return null;
  return (
    <header className="flex h-12 items-center px-2">
      <SidebarTrigger />
    </header>
  );
};

/**
 * @component AppShell
 * @description Wraps pages with the sidebar provider, the sidebar, and the main inset area.
 */
export const AppShell = ({ children }: { children: ReactNode }) => (
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <ReopenTrigger />
      {children}
    </SidebarInset>
  </SidebarProvider>
);
