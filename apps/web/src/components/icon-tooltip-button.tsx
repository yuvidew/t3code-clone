import type { ComponentProps } from "react";
import { Button } from "@repo/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/tooltip";

/**
 * @component IconTooltipButton
 * @description Ghost icon button with a tooltip label; reused for sidebar header/footer actions.
 * @param label Tooltip text, also used as the accessible name.
 */
export const IconTooltipButton = ({
  label,
  children,
  ...props
}: ComponentProps<typeof Button> & { label: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon-sm" aria-label={label} {...props}>
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
);
