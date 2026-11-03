"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState, type ReactNode } from "react";
import { DirectionProvider } from "@repo/ui/components/direction";
import { Toaster } from "@repo/ui/components/sonner";
import { TooltipProvider } from "@repo/ui/components/tooltip";

export function Providers({ children }: { children: ReactNode }) {
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
}
