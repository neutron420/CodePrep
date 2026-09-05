"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  className?: string;
  variant?: "black" | "amber";
}

export function FlowButton({
  text = "Modern Button",
  className,
  variant = "black",
  children,
  ...props
}: FlowButtonProps) {
  const displayText = text || (typeof children === "string" ? children : "Click here");

  const circleBg =
    variant === "amber"
      ? "bg-amber-500"
      : "bg-zinc-800 dark:bg-zinc-800";

  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full border border-zinc-800 bg-zinc-950 text-white px-7 py-2.5 text-sm font-bold cursor-pointer transition-all duration-500 ease-out hover:border-zinc-700 active:scale-95 select-none shadow-md",
        className
      )}
      {...props}
    >
      {/* Left arrow (slides in from left on hover) */}
      <ArrowRight
        className="absolute w-4 h-4 left-[-25%] stroke-white text-white fill-none z-10 opacity-0 group-hover:left-3.5 group-hover:opacity-100 transition-all duration-500 ease-out shrink-0"
      />

      {/* Button text - explicitly white & font-bold so it is always 100% visible */}
      <span className="relative z-10 text-white font-bold tracking-normal transition-all duration-500 ease-out -translate-x-2 group-hover:translate-x-2 select-none">
        {children || displayText}
      </span>

      {/* Expanding hover circle animation */}
      <span
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full opacity-0 group-hover:w-[280px] group-hover:h-[280px] group-hover:opacity-100 transition-all duration-700 ease-out pointer-events-none",
          circleBg
        )}
      />

      {/* Right arrow (slides out to right on hover) */}
      <ArrowRight
        className="absolute w-4 h-4 right-3.5 stroke-white text-white fill-none z-10 opacity-100 group-hover:right-[-25%] group-hover:opacity-0 transition-all duration-500 ease-out shrink-0"
      />
    </button>
  );
}

export default FlowButton;
