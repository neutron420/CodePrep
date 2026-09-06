"use client";

import React from "react";
import { CodingPlatformType } from "@/types/problem";
import { LeetCode } from "@/components/templates/nova/svgs/leetcode";
import { GeeksForGeeks } from "@/components/templates/nova/svgs/geeksforgeeks";
import { CodeChef } from "@/components/templates/nova/svgs/codechef";
import { Codeforces } from "@/components/templates/nova/svgs/codeforces";
import { AtCoder } from "@/components/templates/nova/svgs/atcoder";
import { HackerRank } from "@/components/templates/nova/svgs/hackerrank";
import { Code2, Terminal } from "lucide-react";

interface CodingPlatformIconProps {
  platform: CodingPlatformType | string;
  className?: string;
}

export function CodingPlatformIcon({ platform, className = "size-4" }: CodingPlatformIconProps) {
  const norm = String(platform).toUpperCase();

  switch (norm) {
    case "LEETCODE":
      return <LeetCode className={className} />;

    case "GEEKSFORGEEKS":
      return <GeeksForGeeks className={className} />;

    case "CODECHEF":
      return <CodeChef className={className} />;

    case "CODEFORCES":
      return <Codeforces className={className} />;

    case "ATCODER":
      return <AtCoder className={className} />;

    case "HACKERRANK":
      return <HackerRank className={className} />;

    case "CODESTUDIO":
      // Coding Ninjas / CodeStudio brand icon (Orange / Red Ninja)
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="CodeStudio">
          <rect width="24" height="24" rx="6" fill="#F05A28" />
          <path
            d="M5 12h14M12 5l7 7-7 7"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "HACKEREARTH":
      // HackerEarth brand icon (Dark Blue with bold H)
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="HackerEarth">
          <rect width="24" height="24" rx="6" fill="#2C3454" />
          <path
            d="M7 6v12M17 6v12M7 12h10"
            stroke="#32C5FF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "INTERVIEWBIT":
      // InterviewBit brand icon (Teal with IB)
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="InterviewBit">
          <rect width="24" height="24" rx="6" fill="#009688" />
          <path
            d="M8 7v10M13 7h3a2.5 2.5 0 0 1 0 5H13v5h3a2.5 2.5 0 0 0 0-5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "CUSTOM":
    default:
      return <Terminal className={className} />;
  }
}
