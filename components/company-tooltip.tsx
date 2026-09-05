"use client";

import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CompanyLogo } from "@/components/company-logo";

interface CompanyTooltipProps {
  name: string;
  problemCount?: number;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export function CompanyTooltip({
  name,
  problemCount,
  children,
  side = "top",
  align = "center",
}: CompanyTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider delay={150}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger
          render={<span />}
          onClick={() => {
            // Prevent click bubbling if needed, or toggle tooltip on touch screens
            setOpen((prev) => !prev);
          }}
          className="inline-flex outline-none cursor-pointer focus-visible:ring-1 focus-visible:ring-ring rounded-md"
        >
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="p-2.5 bg-popover/95 backdrop-blur-md text-popover-foreground border border-border/80 shadow-xl rounded-xl z-50 animate-in fade-in-0 zoom-in-95"
        >
          <div className="flex items-center gap-2.5 min-w-[120px]">
            <CompanyLogo name={name} className="size-7 text-xs rounded-md shadow-xs" />
            <div className="flex flex-col text-left">
              <span className="font-bold text-xs leading-tight text-foreground">{name}</span>
              <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                {problemCount !== undefined ? `${problemCount.toLocaleString()} questions` : "LeetCode Tagged"}
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
