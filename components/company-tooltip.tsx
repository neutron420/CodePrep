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
    <TooltipProvider delay={100}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger
          render={<span className="inline-flex outline-none cursor-pointer" />}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="p-2.5 bg-white text-zinc-900 border border-zinc-200 shadow-xl rounded-xl z-50 animate-in fade-in-0 zoom-in-95"
        >
          <div className="flex items-center gap-2.5 min-w-[120px]">
            <CompanyLogo name={name} className="size-6.5 text-xs rounded-md shadow-2xs shrink-0" />
            <div className="flex flex-col text-left min-w-0">
              <span className="font-bold text-xs leading-tight text-zinc-900 truncate">
                {name}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                {problemCount !== undefined
                  ? `${problemCount.toLocaleString()} questions`
                  : "LeetCode Tagged"}
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
