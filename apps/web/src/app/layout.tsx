import "@repo/ui/globals.css";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { Geist } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { cn } from "@repo/ui/lib/utils";

// Geist font exposed as the --font-sans CSS variable used by the theme.
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = { title: "Monorepo App" };

/**
 * @component RootLayout
 * @description Root HTML shell: applies the font, mounts app-wide providers and wraps pages in the sidebar shell.
 */
const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
    <body>
      <Providers>
        <AppShell>{children}</AppShell>
      </Providers>
    </body>
  </html>
);

export default RootLayout;
