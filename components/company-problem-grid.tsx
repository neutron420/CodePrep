"use client";

import { useState, useMemo } from "react";
import {
  ExternalLink,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  Globe,
  MapPin,
  Calendar,
  Flame,
  TrendingUp,
  Landmark,
  Crown,
  Cloud,
  ShieldCheck,
  Cpu,
  ShoppingBag,
  Car,
  UtensilsCrossed,
  MessageSquare,
  Gamepad2,
  Activity,
  Briefcase,
  GraduationCap,
  Compass,
  Radio,
  Zap,
  Building2,
} from "lucide-react";
import { useSolvedProblems } from "@/lib/hooks/use-solved-problems";
import { Card } from "@/components/ui/card";
import { ProblemItem } from "@/types/problem";
import { CompanyLogo } from "@/components/company-logo";
import { CompanyTooltip } from "@/components/company-tooltip";
import { LeetCode } from "@/components/templates/nova/svgs/leetcode";
import { getCompanyDomain } from "@/lib/company-domains";
import { COMPANY_CATEGORIES } from "@/lib/company-categories";
import { getCompanyDetail } from "@/lib/company-details";

function CategoryIcon({ name }: { name?: string }) {
  switch (name) {
    case "Flame":
      return <Flame className="size-3.5 text-rose-500 shrink-0" />;
    case "Sparkles":
      return <Sparkles className="size-3.5 text-fuchsia-500 shrink-0" />;
    case "TrendingUp":
      return <TrendingUp className="size-3.5 text-amber-500 shrink-0" />;
    case "Landmark":
      return <Landmark className="size-3.5 text-emerald-500 shrink-0" />;
    case "Crown":
      return <Crown className="size-3.5 text-purple-500 shrink-0" />;
    case "Cloud":
      return <Cloud className="size-3.5 text-sky-500 shrink-0" />;
    case "ShieldCheck":
      return <ShieldCheck className="size-3.5 text-teal-500 shrink-0" />;
    case "Cpu":
      return <Cpu className="size-3.5 text-indigo-500 shrink-0" />;
    case "ShoppingBag":
      return <ShoppingBag className="size-3.5 text-pink-500 shrink-0" />;
    case "Car":
      return <Car className="size-3.5 text-blue-600 shrink-0" />;
    case "UtensilsCrossed":
      return <UtensilsCrossed className="size-3.5 text-orange-500 shrink-0" />;
    case "MessageSquare":
      return <MessageSquare className="size-3.5 text-cyan-500 shrink-0" />;
    case "Gamepad2":
      return <Gamepad2 className="size-3.5 text-violet-500 shrink-0" />;
    case "Activity":
      return <Activity className="size-3.5 text-rose-600 shrink-0" />;
    case "Briefcase":
      return <Briefcase className="size-3.5 text-blue-500 shrink-0" />;
    case "GraduationCap":
      return <GraduationCap className="size-3.5 text-yellow-500 shrink-0" />;
    case "Compass":
      return <Compass className="size-3.5 text-emerald-600 shrink-0" />;
    case "Radio":
      return <Radio className="size-3.5 text-violet-600 shrink-0" />;
    case "Zap":
      return <Zap className="size-3.5 text-amber-600 shrink-0" />;
    default:
      return <Building2 className="size-3.5 text-primary shrink-0" />;
  }
}

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
  companySlug?: string;
}

export function CompanyProblemGrid({ problems, companyName, companySlug }: CompanyProblemGridProps) {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"GRID" | "LIST">("GRID");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  const { isSolved } = useSolvedProblems();

  // Company metadata & intelligence
  const slug = useMemo(() => {
    return (companySlug || companyName).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  }, [companySlug, companyName]);

  const category = useMemo(() => {
    return COMPANY_CATEGORIES.find((c) => c.slugs.includes(slug));
  }, [slug]);

  const details = useMemo(() => {
    return getCompanyDetail(slug, category?.name);
  }, [slug, category]);

  const domain = useMemo(() => {
    return getCompanyDomain(companyName);
  }, [companyName]);

  // Dynamically extract top DSA interview topics tested at this company
  const topTopics = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of problems) {
      if (p.topics && Array.isArray(p.topics)) {
        for (const t of p.topics) {
          counts[t] = (counts[t] || 0) + 1;
        }
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([topic, count]) => ({ topic, count }));
  }, [problems]);

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
      {/* Header Banner - Rich Company Intel & Details */}
      <div className="p-4 sm:p-6 md:p-7 rounded-2xl bg-card border shadow-xs relative overflow-hidden">
        {/* Ambient atmospheric glow */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 size-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start relative">
          {/* Left Column (Logo, Title, Description, Stats) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            {/* Company Logo - elevated, clean */}
            <div className="shrink-0 p-2 rounded-2xl bg-white dark:bg-card/90 border border-border/80 shadow-xs flex items-center justify-center self-start">
              <CompanyLogo
                name={companyName}
                showTooltip
                problemCount={problems.length}
                className="size-16 sm:size-20 md:size-22 text-2xl sm:text-3xl rounded-xl cursor-pointer transition-transform hover:scale-105"
              />
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <CompanyTooltip name={companyName} problemCount={problems.length} side="bottom" align="start">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-snug break-words hover:text-primary transition-colors cursor-pointer">
                    {companyName}{" "}
                    <span className="font-semibold text-muted-foreground text-base sm:text-xl md:text-2xl inline">
                      Interview Problems
                    </span>
                  </h1>
                </CompanyTooltip>

                {/* Company 1-2 sentence description */}
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                  {details.description}
                </p>
              </div>

              {/* Questions count & Difficulty Stats Badges */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-foreground text-xs font-semibold">
                  <LeetCode className="size-3.5 shrink-0 text-amber-500" />
                  <span>{problems.length.toLocaleString()} questions tagged</span>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                  {easyCount} Easy
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono">
                  {mediumCount} Medium
                </span>
                <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold font-mono">
                  {hardCount} Hard
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (Company Intel Card: Domain, Website, HQ/Founded, Top Tested Topics) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-muted/40 border border-border/70 backdrop-blur-xs">
            {/* Top row: Industry domain badge with vibrant icon & Official website link */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              {category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-background/90 text-foreground text-xs font-semibold border border-border/80 shadow-2xs">
                  <CategoryIcon name={category.iconName} />
                  <span className="truncate max-w-[200px]">{category.name}</span>
                </span>
              )}

              {domain && (
                <a
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium border border-border transition-colors shadow-2xs group ml-auto"
                >
                  <Globe className="size-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  <span className="truncate max-w-[140px] font-mono text-[11px]">{domain}</span>
                  <ExternalLink className="size-2.5 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                </a>
              )}
            </div>

            {/* HQ & Founded / Stage - Full details for all companies */}
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-muted-foreground/80 shrink-0" />
                <span>{details.hq}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground/80 shrink-0" />
                <span>
                  {details.founded && (details.founded.startsWith("19") || details.founded.startsWith("20"))
                    ? `Est. ${details.founded}`
                    : details.founded}
                </span>
              </span>
            </div>

            {/* Top tested DSA topics */}
            {topTopics.length > 0 && (
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  <Sparkles className="size-3 text-amber-500 shrink-0" />
                  <span>Top Focus Topics</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {topTopics.map(({ topic, count }) => (
                    <span
                      key={topic}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-background border border-border text-foreground shadow-2xs"
                    >
                      <span>{topic}</span>
                      <span className="text-[10px] text-muted-foreground font-mono font-normal">
                        ({count})
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Controls Toolbar - Aligned with Header */}
      <div className="flex flex-col gap-3 bg-card p-3 sm:p-4 rounded-xl border shadow-2xs">
        {/* Search - Full width on all screens */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={`Search ${companyName} problems by title or topic...`}
            className="w-full pl-10 pr-4 py-2.5 sm:py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Filters & View Toggle - scrollable on mobile */}
        <div className="flex items-center justify-between gap-2">
          {/* Difficulty selector */}
          <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg border text-xs font-medium overflow-x-auto no-scrollbar">
            {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setDifficultyFilter(diff);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-md capitalize transition-all cursor-pointer whitespace-nowrap text-xs ${
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
