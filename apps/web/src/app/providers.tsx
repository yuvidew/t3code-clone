"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState, type ReactNode } from "react";
import { DirectionProvider } from "@repo/ui/components/direction";
import { Toaster } from "@repo/ui/components/sonner";
import { TooltipProvider } from "@repo/ui/components/tooltip";

/**
 * @component Providers
 * @description Mounts the single QueryClient plus theme, direction, tooltip and toast providers for the whole app.
 */
export const Providers = ({ children }: { children: ReactNode }) => {
  // One QueryClient per browser session, created lazily so it survives re-renders.
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <DirectionProvider dir="ltr">
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </DirectionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
