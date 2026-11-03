import "@repo/ui/globals.css";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { Geist } from "next/font/google";
import { cn } from "@repo/ui/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = { title: "Monorepo App" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
