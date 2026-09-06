"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface VerifiedBadgeProps {
  className?: string;
  size?: number;
  label?: string;
}

export function VerifiedBadge({
  className = "size-3.5",
  label = "Verified Pro Member",
}: VerifiedBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            className={`inline-flex items-center justify-center shrink-0 cursor-default select-none outline-none ${className}`}
            title={label}
          />
        }
      >
        {/* Custom Gold / Yellow Verified Starburst Badge */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full drop-shadow-[0_1px_2px_rgba(245,158,11,0.4)]"
        >
          {/* Golden Starburst / Flower Crest */}
          <path
            d="M12 1L14.7 3.5L18.3 3.1L19.7 6.4L23 7.8L22.6 11.4L25 14.1L22.6 16.8L23 20.4L19.7 21.8L18.3 25.1L14.7 24.7L12 27.2L9.3 24.7L5.7 25.1L4.3 21.8L1 20.4L1.4 16.8L-1 14.1L1.4 11.4L1 7.8L4.3 6.4L5.7 3.1L9.3 3.5L12 1Z"
            transform="scale(0.85) translate(2, 2)"
            className="fill-amber-400 dark:fill-amber-500"
          />
          {/* White/Black contrast Checkmark */}
          <path
            d="M8.8 12.3L11.2 14.7L16.2 9.7"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-[11px] font-semibold bg-zinc-900 text-amber-300 border-amber-500/30">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>{label}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
