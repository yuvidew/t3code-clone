"use client";

import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SessionHeader } from "@/features/sessions/_components/session-header";

/**
 * @component AppShell
 * @description Wraps pages with the sidebar provider, the sidebar, and the main area with its session header.
 */
export const AppShell = ({ children }: { children: ReactNode }) => (
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      {/* Placeholder project/session until sessions are routable. */}
      <SessionHeader project="tscode-clone" title="New thread" />
      {children}
    </SidebarInset>
  </SidebarProvider>
);
