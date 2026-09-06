"use client";

import React from "react";
import { motion, Transition } from "motion/react";
import { cn } from "@/lib/utils";

interface VerticalCutRevealProps {
  children: string;
  splitBy?: "words" | "characters" | "lines";
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random";
  reverse?: boolean;
  containerClassName?: string;
  transition?: Transition;
}

export function VerticalCutReveal({
  children,
  splitBy = "words",
  staggerDuration = 0.1,
  containerClassName,
  transition = {
    type: "spring",
    stiffness: 250,
    damping: 35,
  },
}: VerticalCutRevealProps) {
  const parts = splitBy === "words" ? children.split(" ") : children.split("");

  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center overflow-hidden",
        containerClassName
      )}
    >
      {parts.map((part, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden pb-1"
          style={{ marginRight: splitBy === "words" ? "0.25em" : "0" }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              ...transition,
              delay: index * staggerDuration,
            }}
          >
            {part}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
