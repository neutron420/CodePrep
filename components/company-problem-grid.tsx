"use client";

import { useState, useMemo } from "react";
import { ExternalLink, Search, LayoutGrid, List, Sparkles } from "lucide-react";
import { useSolvedProblems } from "@/lib/hooks/use-solved-problems";
import { Card } from "@/components/ui/card";
import { ProblemItem } from "@/types/problem";
import { CompanyLogo } from "@/components/company-logo";
import { CompanyTooltip } from "@/components/company-tooltip";
import { LeetCode } from "@/components/templates/nova/svgs/leetcode";

const BADGE_COLOR_PALETTES = [
  "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
  "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
  "bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/30",
  "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
  "bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30",
  "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  "bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/30",
];

function getTopicBadgeStyle(topic: string): string {
  const lower = topic.toLowerCase();
  if (lower.includes("array") || lower.includes("vector"))
    return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30";
  if (lower.includes("string") || lower.includes("char"))
    return "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30";
  if (lower.includes("tree") || lower.includes("graph") || lower.includes("trie"))
    return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
  if (lower.includes("dynamic") || lower.includes("dp"))
    return "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30";
  if (lower.includes("hash") || lower.includes("map"))
    return "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30";
  if (lower.includes("sort") || lower.includes("search") || lower.includes("binary"))
    return "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30";
  if (lower.includes("math") || lower.includes("bit"))
    return "bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30";
  if (lower.includes("backtrack") || lower.includes("recursion"))
    return "bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/30";
  if (lower.includes("stack") || lower.includes("queue") || lower.includes("heap"))
    return "bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/30";

  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BADGE_COLOR_PALETTES[Math.abs(hash) % BADGE_COLOR_PALETTES.length];
}

interface CompanyProblemGridProps {
  problems: ProblemItem[];
  companyName: string;
}

export function CompanyProblemGrid({ problems, companyName }: CompanyProblemGridProps) {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"GRID" | "LIST">("GRID");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  const { isSolved } = useSolvedProblems();

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty =
        difficultyFilter === "ALL" || p.difficulty === difficultyFilter;

      return matchesSearch && matchesDifficulty;
    });
  }, [problems, search, difficultyFilter]);

  // Reset pagination when filters change
  const totalPages = Math.ceil(filteredProblems.length / pageSize) || 1;
  const currentPageClamped = Math.min(currentPage, totalPages);

  const paginatedProblems = useMemo(() => {
    const start = (currentPageClamped - 1) * pageSize;
    return filteredProblems.slice(start, start + pageSize);
  }, [filteredProblems, currentPageClamped, pageSize]);

  const easyCount = problems.filter((p) => p.difficulty === "EASY").length;
  const mediumCount = problems.filter((p) => p.difficulty === "MEDIUM").length;
  const hardCount = problems.filter((p) => p.difficulty === "HARD").length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Banner - Compact on mobile */}
      <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-card border shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 size-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 relative">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Company Logo - smaller on mobile with interactive tooltip */}
            <CompanyLogo name={companyName} showTooltip problemCount={problems.length} className="size-12 sm:size-16 text-xl sm:text-2xl shadow-sm rounded-xl border border-border/80 cursor-pointer transition-transform hover:scale-105" />
            <div className="min-w-0 flex-1">
              <CompanyTooltip name={companyName} problemCount={problems.length} side="bottom" align="start">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-foreground leading-tight truncate hover:text-primary transition-colors cursor-pointer">
                  {companyName} Interview Problems
                </h1>
              </CompanyTooltip>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                <LeetCode className="size-3.5 sm:size-4 shrink-0" />
                <span>{problems.length.toLocaleString()} questions tagged</span>
              </p>

              {/* Difficulty Stats Badges */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-bold font-mono">
                  {easyCount} Easy
                </span>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-bold font-mono">
                  {mediumCount} Medium
                </span>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] sm:text-xs font-bold font-mono">
                  {hardCount} Hard
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Controls Toolbar - Stacks on mobile */}
      <div className="flex flex-col gap-3 bg-card p-3 rounded-xl border">
        {/* Search - Full width on all */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search problem title..."
            className="w-full pl-9 pr-3 py-2 sm:py-1.5 rounded-lg border bg-background text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Filters & View Toggle - scrollable on mobile */}
        <div className="flex items-center justify-between gap-2">
          {/* Difficulty selector - horizontally scrollable on mobile */}
          <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg border text-[11px] font-medium overflow-x-auto no-scrollbar">
            {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setDifficultyFilter(diff);
                  setCurrentPage(1);
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-md capitalize transition-all cursor-pointer whitespace-nowrap ${
                  difficultyFilter === diff
                    ? "bg-card text-foreground font-bold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {diff.toLowerCase()}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg border shrink-0">
            <button
              onClick={() => setViewMode("GRID")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "GRID" ? "bg-card text-primary shadow-2xs" : "text-muted-foreground"
              }`}
              title="Box Format Grid"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("LIST")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "LIST" ? "bg-card text-primary shadow-2xs" : "text-muted-foreground"
              }`}
              title="List View"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Questions View */}
      {filteredProblems.length === 0 ? (
        <div className="text-center py-12 sm:py-16 border rounded-xl bg-card">
          <Sparkles className="mx-auto size-8 sm:size-10 text-muted-foreground/40 mb-2" />
          <h3 className="text-sm sm:text-base font-semibold">No questions match your filter</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
            Try adjusting your search query or difficulty tabs.
          </p>
        </div>
      ) : viewMode === "GRID" ? (
        /* Box Format Card Grid - Single col on mobile, 2 on tablet, 3 on desktop */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {paginatedProblems.map((p) => {
            const solved = isSolved(p.id);
            return (
              <Card
                key={p.id}
                className={`p-4 sm:p-5 rounded-none flex flex-col justify-between transition-all duration-200 hover:border-primary/50 hover:shadow-sm relative group border ${
                  solved ? "bg-primary/5 border-emerald-500/30" : "bg-card"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                    <span className="text-[10px] font-mono font-medium text-muted-foreground">
                      #{p.slug}
                    </span>

                    {/* Difficulty Badge */}
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                        p.difficulty === "EASY"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : p.difficulty === "MEDIUM"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </div>

                  {/* Problem Title */}
                  <h3
                    className={`font-bold text-[13px] sm:text-sm leading-snug text-foreground mb-2 sm:mb-3 line-clamp-2 ${
                      solved ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {p.title}
                  </h3>

                  {/* Topics Tags Pills - Show ALL topics */}
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
                    {p.topics.map((t: string, i: number) => (
                      <span
                        key={i}
                        className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-medium border ${getTopicBadgeStyle(
                          t
                        )}`}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action & Tagged Companies Avatars */}
                <div className="pt-2 sm:pt-3 border-t space-y-2 mt-auto">
                  {/* Companies Asking Avatars */}
                  {p.companiesAsking && p.companiesAsking.length > 0 && (
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="text-[10px] font-medium text-muted-foreground">Asked by:</span>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {p.companiesAsking.slice(0, 4).map((c, idx) => (
                          <CompanyLogo
                            key={idx}
                            name={c.name}
                            showTooltip
                            className="size-5 sm:size-6 text-[9px] sm:text-xs rounded-md border border-border/60 cursor-pointer hover:scale-110 transition-transform"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LeetCode Direct Link Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground font-mono truncate max-w-[40%]">
                      #{p.slug}
                    </span>

                    <a
                      href={p.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-primary hover:underline group-hover:translate-x-0.5 transition-transform"
                    >
                      <LeetCode className="size-3.5 sm:size-4" />
                      <span>Solve</span>
                      <ExternalLink className="size-2.5 sm:size-3" />
                    </a>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List Table View - Horizontally scrollable on mobile */
        <div className="rounded-xl border bg-card overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className="bg-secondary/40 text-muted-foreground uppercase font-medium border-b">
              <tr>
                <th className="py-3 px-3 sm:px-4">Problem Title</th>
                <th className="py-3 px-3 sm:px-4">Difficulty</th>
                <th className="py-3 px-3 sm:px-4">Topics</th>
                <th className="py-3 px-3 sm:px-4">Companies</th>
                <th className="py-3 px-3 sm:px-4 text-right">LeetCode</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedProblems.map((p) => {
                const solved = isSolved(p.id);
                return (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-medium text-foreground">
                      <span className={solved ? "line-through text-muted-foreground" : ""}>
                        {p.title}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          p.difficulty === "EASY"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : p.difficulty === "MEDIUM"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.topics.slice(0, 3).map((t: string, i: number) => (
                          <span
                            key={i}
                            className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium border ${getTopicBadgeStyle(
                              t
                            )}`}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex items-center gap-1">
                        {p.companiesAsking?.slice(0, 3).map((c, idx) => (
                          <CompanyLogo
                            key={idx}
                            name={c.name}
                            showTooltip
                            className="size-5 text-[9px] rounded-md cursor-pointer hover:scale-110 transition-transform"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right">
                      <a
                        href={p.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
                      >
                        <LeetCode className="size-3.5" />
                        <span>Solve</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls - Mobile optimized */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t text-xs">
          <span className="text-muted-foreground text-center sm:text-left">
            Showing <span className="font-semibold text-foreground">{paginatedProblems.length}</span> of{" "}
            <span className="font-semibold text-foreground">{filteredProblems.length}</span> questions
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPageClamped === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-2 sm:py-1.5 rounded-lg border font-medium bg-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition-colors cursor-pointer"
            >
              Previous
            </button>

            <span className="text-muted-foreground px-2 whitespace-nowrap">
              Page {currentPageClamped} of {totalPages}
            </span>

            <button
              disabled={currentPageClamped === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-2 sm:py-1.5 rounded-lg border font-medium bg-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
