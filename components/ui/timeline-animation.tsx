"use client";

import React from "react";
import { motion, Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface TimelineContentProps {
  as?: "div" | "p" | "article" | "section" | "span";
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  customVariants?: Variants | ((i: number) => Variants);
  className?: string;
  children: React.ReactNode;
}

export function TimelineContent({
  as = "div",
  animationNum = 0,
  customVariants,
  className,
  children,
}: TimelineContentProps) {
  const Component = motion[as] as React.ElementType;

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  const variantsToUse =
    typeof customVariants === "function"
      ? (customVariants as (i: number) => Variants)(animationNum)
      : customVariants || defaultVariants;

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      custom={animationNum}
      variants={variantsToUse}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
