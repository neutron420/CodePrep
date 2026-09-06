"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  ExternalLink,
  Search,
  LayoutGrid,
  List,
  FileCode2,
  Tag,
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
  Star,
  ThumbsUp,
  Clock,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  X,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { useSolvedProblems } from "@/lib/hooks/use-solved-problems";
import { useTargetCompanies } from "@/lib/hooks/use-target-companies";
import { Card } from "@/components/ui/card";
import { ProblemItem, CodingPlatformType } from "@/types/problem";
import { CompanyLogo } from "@/components/company-logo";
import { CompanyTooltip } from "@/components/company-tooltip";
import { getCompanyDomain } from "@/lib/company-domains";
import { COMPANY_CATEGORIES } from "@/lib/company-categories";
import { getCompanyDetail } from "@/lib/company-details";
import { CodingPlatformIcon } from "@/components/coding-platform-icon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

function getPlatformBadge(platform?: CodingPlatformType) {
  switch (platform) {
    case "LEETCODE":
      return { label: "LeetCode", badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" };
    case "GEEKSFORGEEKS":
      return { label: "GFG", badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
    case "CODECHEF":
      return { label: "CodeChef", badgeClass: "bg-yellow-600/10 text-yellow-700 dark:text-yellow-400 border-yellow-600/30" };
    case "CODEFORCES":
      return { label: "Codeforces", badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" };
    case "ATCODER":
      return { label: "AtCoder", badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30" };
    case "HACKERRANK":
      return { label: "HackerRank", badgeClass: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30" };
    case "CODESTUDIO":
      return { label: "CodeStudio", badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" };
    case "HACKEREARTH":
      return { label: "HackerEarth", badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30" };
    case "INTERVIEWBIT":
      return { label: "InterviewBit", badgeClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30" };
    default:
      return { label: "Direct Q", badgeClass: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30" };
  }
}

function CategoryIcon({ name }: { name?: string }) {
  switch (name) {
    case "Flame":
      return <Flame className="size-3.5 text-rose-500 shrink-0" />;
    case "Sparkles":
      return <Zap className="size-3.5 text-fuchsia-500 shrink-0" />;
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

const SORT_OPTIONS = [
  { id: "recent", label: "Most Recent" },
  { id: "number-asc", label: "LeetCode # (1 → 3000)" },
  { id: "number-desc", label: "LeetCode # (3000 → 1)" },
  { id: "title-asc", label: "Title (A → Z)" },
  { id: "diff-asc", label: "Difficulty (Easy → Hard)" },
  { id: "diff-desc", label: "Difficulty (Hard → Easy)" },
  { id: "popular", label: "Most Verified / Popular" },
] as const;

type SortOptionType = (typeof SORT_OPTIONS)[number]["id"];

export function CompanyProblemGrid({ problems, companyName, companySlug }: CompanyProblemGridProps) {
  // Discovery & Search
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filters
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [timeframeFilter, setTimeframeFilter] = useState<string>("ALL");
  const [platformFilter, setPlatformFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SOLVED" | "UNSOLVED">("ALL");
  const [sourceFilter, setSourceFilter] = useState<"ALL" | "CURATED" | "COMMUNITY">("ALL");

  // Secondary Toolbar: Sort, View, Pagination & Modals
  const [sortBy, setSortBy] = useState<SortOptionType>("recent");
  const [viewMode, setViewMode] = useState<"GRID" | "LIST">("GRID");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [filterTopicSearch, setFilterTopicSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Upvoting & solved state
  const [upvotesState, setUpvotesState] = useState<Record<number, number>>({});
  const [votedIds, setVotedIds] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem("codeprep_upvoted_problems");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          return new Set(arr);
        }
      }
    } catch {
      // ignore
    }
    return new Set();
  });
  const pageSize = 12;

  const { isSolved } = useSolvedProblems();
  const { isTarget, toggleTarget } = useTargetCompanies();

  // Responsive mobile detector
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Keyboard shortcut listener for / and Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleUpvote = async (problemId: number) => {
    if (votedIds.has(problemId)) {
      toast.info("You've already verified this question!");
      return;
    }

    const nextVoted = new Set(votedIds).add(problemId);
    setVotedIds(nextVoted);

    try {
      localStorage.setItem("codeprep_upvoted_problems", JSON.stringify(Array.from(nextVoted)));
    } catch (e) {
      console.error(e);
    }

    setUpvotesState((prev) => ({
      ...prev,
      [problemId]: (prev[problemId] ?? 0) + 1,
    }));

    const realId = problemId >= 1_000_000 ? problemId - 1_000_000 : problemId;
    try {
      const res = await fetch(`/api/submissions/${realId}/upvote`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && !data.alreadyVoted) {
        toast.success("Verified question!");
      } else if (data.alreadyVoted) {
        toast.info("You've already verified this question.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Company metadata
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

  // Extract all topics dynamically with counts
  const allTopicsWithCounts = useMemo(() => {
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
      .map(([topic, count]) => ({ topic, count }));
  }, [problems]);

  // Popular topics for the horizontal strip (top 8)
  const popularTopics = useMemo(() => allTopicsWithCounts.slice(0, 8), [allTopicsWithCounts]);

  // Available platforms in this company problem set
  const availablePlatforms = useMemo(() => {
    const set = new Set<string>();
    for (const p of problems) {
      if (p.platform) set.add(p.platform);
    }
    return Array.from(set);
  }, [problems]);

  // Toggle single topic
  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
    setCurrentPage(1);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSearch("");
    setDifficultyFilter("ALL");
    setSelectedTopics([]);
    setTimeframeFilter("ALL");
    setPlatformFilter("ALL");
    setStatusFilter("ALL");
    setSourceFilter("ALL");
    setCurrentPage(1);
  };

  // Active filter count calculation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (difficultyFilter !== "ALL") count++;
    if (selectedTopics.length > 0) count += selectedTopics.length;
    if (timeframeFilter !== "ALL") count++;
    if (platformFilter !== "ALL") count++;
    if (statusFilter !== "ALL") count++;
    if (sourceFilter !== "ALL") count++;
    return count;
  }, [difficultyFilter, selectedTopics, timeframeFilter, platformFilter, statusFilter, sourceFilter]);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      // 1. Search (Title, LC Number, Slug, Topics, Platform)
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSlug = p.slug.toLowerCase().includes(q);
        const matchNumber = p.leetcodeNumber != null && String(p.leetcodeNumber).includes(q);
        const matchPlatform = p.platform?.toLowerCase().includes(q);
        const matchTopic = p.topics?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSlug && !matchNumber && !matchPlatform && !matchTopic) {
          return false;
        }
      }

      // 2. Difficulty
      if (difficultyFilter !== "ALL" && p.difficulty !== difficultyFilter) {
        return false;
      }

      // 3. Topics (matches any of the selected topics)
      if (selectedTopics.length > 0) {
        if (!p.topics || !selectedTopics.some((st) => p.topics.includes(st))) {
          return false;
        }
      }

      // 4. Timeframe
      if (timeframeFilter === "THIRTY_DAYS" && p.timeframe !== "THIRTY_DAYS") return false;
      if (
        timeframeFilter === "THREE_MONTHS" &&
        !(p.timeframe === "THIRTY_DAYS" || p.timeframe === "THREE_MONTHS")
      )
        return false;
      if (
        timeframeFilter === "SIX_MONTHS" &&
        !(
          p.timeframe === "THIRTY_DAYS" ||
          p.timeframe === "THREE_MONTHS" ||
          p.timeframe === "SIX_MONTHS"
        )
      )
        return false;
      if (
        timeframeFilter === "MORE_THAN_SIX_MONTHS" &&
        !(p.timeframe === "MORE_THAN_SIX_MONTHS" || p.timeframe === "ALL")
      )
        return false;

      // 5. Platform
      if (platformFilter !== "ALL" && p.platform !== platformFilter) {
        return false;
      }

      // 6. Solved Status
      if (statusFilter === "SOLVED" && !isSolved(p.id)) return false;
      if (statusFilter === "UNSOLVED" && isSolved(p.id)) return false;

      // 7. Source
      if (sourceFilter === "COMMUNITY" && !p.isCommunity) return false;
      if (sourceFilter === "CURATED" && p.isCommunity) return false;

      return true;
    });
  }, [
    problems,
    search,
    difficultyFilter,
    selectedTopics,
    timeframeFilter,
    platformFilter,
    statusFilter,
    sourceFilter,
    isSolved,
  ]);

  // Sort problems
  const sortedProblems = useMemo(() => {
    const list = [...filteredProblems];
    switch (sortBy) {
      case "number-asc":
        return list.sort((a, b) => (a.leetcodeNumber ?? 999999) - (b.leetcodeNumber ?? 999999));
      case "number-desc":
        return list.sort((a, b) => (b.leetcodeNumber ?? 0) - (a.leetcodeNumber ?? 0));
      case "title-asc":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "diff-asc": {
        const rank = { EASY: 1, MEDIUM: 2, HARD: 3 };
        return list.sort((a, b) => rank[a.difficulty] - rank[b.difficulty]);
      }
      case "diff-desc": {
        const rank = { EASY: 1, MEDIUM: 2, HARD: 3 };
        return list.sort((a, b) => rank[b.difficulty] - rank[a.difficulty]);
      }
      case "popular":
        return list.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
      case "recent":
      default:
        return list;
    }
  }, [filteredProblems, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProblems.length / pageSize) || 1;
  const currentPageClamped = Math.min(currentPage, totalPages);

  const paginatedProblems = useMemo(() => {
    const start = (currentPageClamped - 1) * pageSize;
    return sortedProblems.slice(start, start + pageSize);
  }, [sortedProblems, currentPageClamped, pageSize]);

  // Counts for UI indicators
  const easyCount = useMemo(() => problems.filter((p) => p.difficulty === "EASY").length, [problems]);
  const mediumCount = useMemo(() => problems.filter((p) => p.difficulty === "MEDIUM").length, [problems]);
  const hardCount = useMemo(() => problems.filter((p) => p.difficulty === "HARD").length, [problems]);
  const solvedCount = useMemo(() => problems.filter((p) => isSolved(p.id)).length, [problems, isSolved]);
  const communityCount = useMemo(() => problems.filter((p) => p.isCommunity).length, [problems]);
  const curatedCount = problems.length - communityCount;
  const thirtyDaysCount = useMemo(() => problems.filter((p) => p.timeframe === "THIRTY_DAYS").length, [problems]);
  const threeMonthsCount = useMemo(
    () => problems.filter((p) => p.timeframe === "THIRTY_DAYS" || p.timeframe === "THREE_MONTHS").length,
    [problems]
  );
  const sixMonthsCount = useMemo(
    () =>
      problems.filter(
        (p) =>
          p.timeframe === "THIRTY_DAYS" ||
          p.timeframe === "THREE_MONTHS" ||
          p.timeframe === "SIX_MONTHS"
      ).length,
    [problems]
  );
  const moreThanSixMonthsCount = Math.max(0, problems.length - sixMonthsCount);

  const timeframeLabels: Record<string, string> = {
    ALL: "All Time",
    THIRTY_DAYS: "Past 30 Days",
    THREE_MONTHS: "Past 3 Months",
    SIX_MONTHS: "Past 6 Months",
    MORE_THAN_SIX_MONTHS: "Past Year (6+ Mo)",
  };

  const currentSortLabel = SORT_OPTIONS.find((s) => s.id === sortBy)?.label || "Most Recent";

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ========================================================================= */}
      {/* 1. COMPANY HEADER                                                         */}
      {/* Compact, clean, horizontal desktop layout, naturally stacked mobile       */}
      {/* ========================================================================= */}
      <div className="p-3.5 sm:p-5 md:p-6 rounded-2xl bg-card border shadow-xs relative overflow-hidden">
        {/* Ambient subtle glow */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 size-56 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-5 relative">
          {/* Identity: Logo + Title + Category + Meta */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="shrink-0 p-1.5 sm:p-2 rounded-xl bg-white dark:bg-card/90 border border-border/80 shadow-xs flex items-center justify-center">
              <CompanyLogo
                name={companyName}
                showTooltip
                problemCount={problems.length}
                className="size-11 sm:size-14 md:size-16 text-base sm:text-xl rounded-lg cursor-pointer transition-transform hover:scale-105"
              />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <CompanyTooltip name={companyName} problemCount={problems.length} side="bottom" align="start">
                  <h1 className="text-lg sm:text-2xl font-bold text-foreground tracking-tight leading-tight hover:text-primary transition-colors cursor-pointer">
                    {companyName}
                  </h1>
                </CompanyTooltip>

                {category && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/80 text-foreground text-[10px] sm:text-xs font-semibold border border-border/70 shadow-2xs">
                    <CategoryIcon name={category.iconName} />
                    <span className="truncate max-w-[140px] sm:max-w-[180px]">{category.name}</span>
                  </span>
                )}
              </div>

              {/* Description - 2 lines on mobile, full on desktop */}
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">
                {details.description}
              </p>

              {/* Location, Founded & Website */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3 text-muted-foreground/70 shrink-0" />
                  <span>{details.hq}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3 text-muted-foreground/70 shrink-0" />
                  <span>
                    {details.founded && (details.founded.startsWith("19") || details.founded.startsWith("20"))
                      ? `Est. ${details.founded}`
                      : details.founded}
                  </span>
                </span>
                {domain && (
                  <a
                    href={`https://${domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-mono text-[11px] transition-colors group"
                  >
                    <Globe className="size-3 shrink-0 text-muted-foreground group-hover:text-primary" />
                    <span>{domain}</span>
                    <ExternalLink className="size-2.5 shrink-0" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Action: Pin Target */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => toggleTarget(slug)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-2xs cursor-pointer ${
                isTarget(slug)
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25"
                  : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border"
              }`}
              title={isTarget(slug) ? "Pinned in My Target Companies" : "Pin to My Target Companies"}
            >
              <Star className={`size-3.5 shrink-0 ${isTarget(slug) ? "fill-amber-400 text-amber-500" : ""}`} />
              <span>{isTarget(slug) ? "Targeted" : "Pin Target"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH — PRIMARY DISCOVERY CONTROL                                     */}
      {/* Prominent, large, full-width search with keyboard shortcut & clear button */}
      {/* ========================================================================= */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 size-4 sm:size-4.5 text-muted-foreground pointer-events-none" />
        <input
          ref={searchInputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search problems by title, number, topic, platform..."
          className="w-full pl-10 sm:pl-11 pr-20 sm:pr-24 py-2.5 sm:py-3 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground shadow-2xs"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {search ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted/80 border border-border rounded">
              <span>/</span>
            </kbd>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. POPULAR TOPICS                                                         */}
      {/* Horizontal scrolling row on mobile, single row on desktop                 */}
      {/* ========================================================================= */}
      {popularTopics.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Tag className="size-3 text-primary shrink-0" />
            <span>Popular Topics:</span>
          </span>

          {popularTopics.map(({ topic, count }) => {
            const isSelected = selectedTopics.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-2xs font-semibold"
                    : "bg-card hover:bg-muted text-foreground border-border/80"
                }`}
              >
                <span>{topic}</span>
                <span
                  className={`text-[10px] font-mono ${
                    isSelected ? "text-primary-foreground/90 font-bold" : "text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {allTopicsWithCounts.length > 8 && (
            <button
              type="button"
              onClick={() => setIsFilterSheetOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 transition-all shrink-0 cursor-pointer whitespace-nowrap"
            >
              <span>+ View all ({allTopicsWithCounts.length})</span>
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PROBLEM SUMMARY + 5. DIFFICULTY (PRIMARY FILTER)                       */}
      {/* Clean segmented control for difficulty directly accessible                */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        {/* Total Problems Count */}
        <div className="flex items-baseline gap-2">
          <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            {filteredProblems.length.toLocaleString()} Problems
          </h2>
          {filteredProblems.length !== problems.length && (
            <span className="text-xs text-muted-foreground">
              (of {problems.length.toLocaleString()})
            </span>
          )}
        </div>

        {/* Segmented Control for Difficulty Filter */}
        <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/70 text-xs font-medium overflow-x-auto no-scrollbar self-start sm:self-auto">
          {[
            { id: "ALL", label: "All", count: problems.length },
            { id: "EASY", label: "Easy", count: easyCount },
            { id: "MEDIUM", label: "Medium", count: mediumCount },
            { id: "HARD", label: "Hard", count: hardCount },
          ].map((diff) => {
            const isSelected = difficultyFilter === diff.id;
            return (
              <button
                key={diff.id}
                type="button"
                onClick={() => {
                  setDifficultyFilter(diff.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? "bg-card text-foreground font-bold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{diff.label}</span>
                <span
                  className={`text-[10px] font-mono px-1 py-0.2 rounded font-semibold ${
                    isSelected
                      ? diff.id === "EASY"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : diff.id === "MEDIUM"
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : diff.id === "HARD"
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        : "bg-primary/10 text-primary"
                      : "text-muted-foreground/80"
                  }`}
                >
                  {diff.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. SECONDARY ACTIONS TOOLBAR (FILTER / SORT / VIEW)                       */}
      {/* Unified control area for secondary actions                                */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-2.5 pt-0.5">
        {/* Left: Filter Trigger Button */}
        <button
          type="button"
          onClick={() => setIsFilterSheetOpen(true)}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
            activeFilterCount > 0
              ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
              : "bg-card hover:bg-muted text-foreground border-border"
          }`}
        >
          <SlidersHorizontal className="size-3.5 shrink-0" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="size-4.5 rounded-full bg-white text-primary text-[10px] font-extrabold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Right: Sort Menu + View Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer shadow-2xs"
                />
              }
            >
              <ArrowUpDown className="size-3.5 text-muted-foreground shrink-0" />
              <span className="hidden sm:inline text-muted-foreground">Sort:</span>
              <span className="font-semibold truncate max-w-[120px] sm:max-w-[160px]">
                {currentSortLabel}
              </span>
              <ChevronDown className="size-3 text-muted-foreground shrink-0 ml-0.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5">
              <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase px-2 py-1">
                Sort Questions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={`flex items-center justify-between text-xs px-2.5 py-2 rounded-lg cursor-pointer ${
                    sortBy === opt.id ? "bg-primary/10 text-primary font-semibold" : ""
                  }`}
                >
                  <span>{opt.label}</span>
                  {sortBy === opt.id && <Check className="size-3.5 text-primary stroke-[2.5]" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/70 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("GRID")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === "GRID"
                  ? "bg-card text-primary font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="size-3.5" />
              <span className="hidden md:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("LIST")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === "LIST"
                  ? "bg-card text-primary font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="List View"
            >
              <List className="size-3.5" />
              <span className="hidden md:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 9. ACTIVE FILTERS                                                         */}
      {/* Shown directly above results whenever any filter is applied               */}
      {/* ========================================================================= */}
      {(activeFilterCount > 0 || search.trim()) && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1 mr-0.5">
            <span>Active:</span>
          </span>

          {search.trim() && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-foreground border border-border shrink-0">
              <span>"{search}"</span>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {difficultyFilter !== "ALL" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-foreground border border-border shrink-0 capitalize">
              <span>Difficulty: {difficultyFilter.toLowerCase()}</span>
              <button
                type="button"
                onClick={() => setDifficultyFilter("ALL")}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {selectedTopics.map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 shrink-0"
            >
              <span>{topic}</span>
              <button
                type="button"
                onClick={() => toggleTopic(topic)}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}

          {timeframeFilter !== "ALL" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-foreground border border-border shrink-0">
              <span>Time: {timeframeLabels[timeframeFilter]}</span>
              <button
                type="button"
                onClick={() => setTimeframeFilter("ALL")}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {platformFilter !== "ALL" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-foreground border border-border shrink-0">
              <span>Platform: {getPlatformBadge(platformFilter as CodingPlatformType).label}</span>
              <button
                type="button"
                onClick={() => setPlatformFilter("ALL")}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {statusFilter !== "ALL" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-foreground border border-border shrink-0 capitalize">
              <span>Status: {statusFilter.toLowerCase()}</span>
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {sourceFilter !== "ALL" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-foreground border border-border shrink-0 capitalize">
              <span>Source: {sourceFilter.toLowerCase()}</span>
              <button
                type="button"
                onClick={() => setSourceFilter("ALL")}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={resetAllFilters}
            className="text-[11px] text-primary hover:underline font-semibold whitespace-nowrap ml-1 cursor-pointer shrink-0"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. PROBLEM LIST / GRID                                                   */}
      {/* Single column on mobile, responsive multi-col on desktop                  */}
      {/* ========================================================================= */}
      {sortedProblems.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 sm:py-16 border rounded-2xl bg-card p-6">
          <div className="mx-auto size-12 rounded-full bg-muted/70 flex items-center justify-center mb-3">
            <Search className="size-6 text-muted-foreground/60" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">No problems match your filters</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Try adjusting your search query, difficulty, timeframe, or topic filters.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="size-3.5" />
            <span>Clear All Filters</span>
          </button>
        </div>
      ) : viewMode === "GRID" ? (
        /* Box Format Card Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {paginatedProblems.map((p) => {
            const solved = isSolved(p.id);
            const platformInfo = getPlatformBadge(p.platform);
            const isUpvoted = votedIds.has(p.id);
            const currentVotes = (p.upvotes ?? 0) + (upvotesState[p.id] ?? 0);
            const displayCompanies =
              p.companiesAsking && p.companiesAsking.length > 0
                ? p.companiesAsking
                : p.isCommunity
                ? [{ name: companyName, slug: companySlug || "" }]
                : [];

            return (
              <Card
                key={p.id}
                className={`p-4 sm:p-5 rounded-xl flex flex-col justify-between transition-all duration-200 hover:border-primary/50 hover:shadow-sm relative group border ${
                  solved ? "bg-primary/5 border-emerald-500/30" : "bg-card"
                }`}
              >
                <div>
                  {/* Top Bar: Platform Logo + Round / ID + Difficulty */}
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <CodingPlatformIcon platform={p.platform || "LEETCODE"} className="size-4 shrink-0" />
                      <span className="text-[10px] font-mono font-medium text-muted-foreground">
                        {p.isCommunity ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                            Community
                          </span>
                        ) : p.leetcodeNumber ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-muted text-foreground border border-border/80">
                            LC {p.leetcodeNumber}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">{p.slug}</span>
                        )}
                      </span>

                      {p.roundType && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60 truncate max-w-[110px]">
                          {p.roundType}
                        </span>
                      )}

                      {/* Recency Badge */}
                      {p.interviewDate ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                          <Calendar className="size-2.5" />
                          <span>Asked {p.interviewDate}</span>
                        </span>
                      ) : p.timeframe === "THIRTY_DAYS" ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Clock className="size-2.5" />
                          <span>Past 30 Days</span>
                        </span>
                      ) : p.timeframe === "THREE_MONTHS" ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
                          <Clock className="size-2.5" />
                          <span>Past 3 Months</span>
                        </span>
                      ) : p.timeframe === "SIX_MONTHS" ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
                          <Clock className="size-2.5" />
                          <span>Past 6 Months</span>
                        </span>
                      ) : null}
                    </div>

                    {/* Difficulty Badge */}
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
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

                  {/* Problem Title (with LeetCode number if available) */}
                  <h3
                    className={`font-bold text-[13px] sm:text-sm leading-snug text-foreground mb-2 line-clamp-2 ${
                      solved ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {p.leetcodeNumber ? `${p.leetcodeNumber}. ${p.title}` : p.title}
                  </h3>

                  {/* Optional Notes for Community Questions */}
                  {p.notes && (
                    <p className="text-[11px] text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/50 mb-2.5 line-clamp-2 italic">
                      &ldquo;{p.notes}&rdquo;
                    </p>
                  )}

                  {/* Topics Tags Pills (WITHOUT # symbol) */}
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3">
                    {p.topics.map((t: string, i: number) => (
                      <span
                        key={i}
                        className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-medium border ${getTopicBadgeStyle(
                          t
                        )}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action & Tagged Companies */}
                <div className="pt-2 sm:pt-2.5 border-t space-y-2 mt-auto">
                  {displayCompanies.length > 0 && (
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="text-[10px] font-medium text-muted-foreground">Asked by:</span>
                      <div className="flex items-center gap-1.5">
                        {displayCompanies.slice(0, 4).map((c, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <CompanyLogo
                              name={c.name}
                              showTooltip
                              className="size-5 sm:size-5.5 text-[9px] sm:text-xs rounded-md border border-border/60 cursor-pointer hover:scale-110 transition-transform"
                            />
                            {p.isCommunity && idx === 0 && (
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-[11px] font-semibold text-foreground/90 truncate">
                                  {c.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                  {p.submittedBy?.displayName ? `• by ${p.submittedBy.displayName}` : "• Anon"}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Platform Link & Upvote Action */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    {p.isCommunity ? (
                      <button
                        type="button"
                        onClick={() => handleUpvote(p.id)}
                        disabled={isUpvoted}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-border/80 bg-background text-muted-foreground transition-all ${
                          isUpvoted
                            ? "opacity-80 cursor-default"
                            : "hover:bg-muted hover:text-foreground cursor-pointer active:scale-95 shadow-2xs"
                        }`}
                        title={isUpvoted ? "You verified this question" : "I was also asked this question (+1 verification)"}
                      >
                        <ThumbsUp className="size-3 text-muted-foreground" />
                        <span>{currentVotes} verified</span>
                        {isUpvoted && <span className="text-[10px] font-semibold text-muted-foreground">✓</span>}
                      </button>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground font-mono truncate max-w-[40%]">
                        {p.leetcodeNumber ? `LC ${p.leetcodeNumber}` : p.slug}
                      </span>
                    )}

                    {p.leetcodeUrl ? (
                      <a
                        href={p.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-primary hover:underline group-hover:translate-x-0.5 transition-transform shrink-0"
                      >
                        <CodingPlatformIcon platform={p.platform || "LEETCODE"} className="size-3.5 sm:size-4 shrink-0" />
                        <span>Solve on {platformInfo.label}</span>
                        <ExternalLink className="size-2.5 sm:size-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">In-person Q</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View (Table on Desktop, Adaptive on Mobile) */
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px] sm:min-w-[750px]">
              <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider border-b">
                <tr>
                  <th className="py-3 px-3 sm:px-4 min-w-[220px] sm:min-w-[280px]">Problem Title</th>
                  <th className="py-3 px-3 sm:px-4">Platform</th>
                  <th className="py-3 px-3 sm:px-4">Difficulty</th>
                  <th className="py-3 px-3 sm:px-4">Topics</th>
                  <th className="py-3 px-3 sm:px-4">Companies</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedProblems.map((p) => {
                  const solved = isSolved(p.id);
                  const platformInfo = getPlatformBadge(p.platform);
                  const isUpvoted = votedIds.has(p.id);
                  const currentVotes = (p.upvotes ?? 0) + (upvotesState[p.id] ?? 0);
                  const displayCompanies =
                    p.companiesAsking && p.companiesAsking.length > 0
                      ? p.companiesAsking
                      : p.isCommunity
                      ? [{ name: companyName, slug: companySlug || "" }]
                      : [];

                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3 sm:px-4 font-medium text-foreground min-w-[220px] sm:min-w-[280px]">
                        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                          <CodingPlatformIcon platform={p.platform || "LEETCODE"} className="size-4 shrink-0 mt-0.5 sm:mt-0" />
                          <div className="min-w-0 flex flex-col gap-0.5">
                            <span className={`leading-snug font-medium ${solved ? "line-through text-muted-foreground" : ""}`}>
                              {p.leetcodeNumber ? `${p.leetcodeNumber}. ${p.title}` : p.title}
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {p.roundType && (
                                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60 whitespace-nowrap">
                                  {p.roundType}
                                </span>
                              )}
                              {p.interviewDate ? (
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                                  Asked {p.interviewDate}
                                </span>
                              ) : p.timeframe === "THIRTY_DAYS" ? (
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                                  Past 30 Days
                                </span>
                              ) : p.timeframe === "THREE_MONTHS" ? (
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap">
                                  Past 3 Months
                                </span>
                              ) : p.timeframe === "SIX_MONTHS" ? (
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 whitespace-nowrap">
                                  Past 6 Months
                                </span>
                              ) : null}
                              {p.isCommunity && (
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                  • {p.submittedBy?.displayName ? `by ${p.submittedBy.displayName}` : "Anon"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${platformInfo.badgeClass}`}>
                          <CodingPlatformIcon platform={p.platform || "LEETCODE"} className="size-3" />
                          <span>{platformInfo.label}</span>
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
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        <div className="flex items-center gap-1">
                          {displayCompanies.slice(0, 3).map((c, idx) => (
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
                        <div className="inline-flex items-center gap-2 justify-end">
                          {p.isCommunity && (
                            <button
                              type="button"
                              onClick={() => handleUpvote(p.id)}
                              disabled={isUpvoted}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border border-border/80 bg-background text-muted-foreground transition-all ${
                                isUpvoted
                                  ? "opacity-80 cursor-default"
                                  : "hover:bg-muted hover:text-foreground cursor-pointer active:scale-95"
                              }`}
                              title={isUpvoted ? "You verified this question" : "I was also asked this question (+1 verification)"}
                            >
                              <ThumbsUp className="size-2.5 text-muted-foreground" />
                              <span>{currentVotes}</span>
                              {isUpvoted && <span className="text-[9px] font-semibold text-muted-foreground">✓</span>}
                            </button>
                          )}
                          {p.leetcodeUrl ? (
                            <a
                              href={p.leetcodeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline text-xs"
                            >
                              <CodingPlatformIcon platform={p.platform || "LEETCODE"} className="size-3.5" />
                              <span>Solve</span>
                              <ExternalLink className="size-2.5" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">Direct</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGINATION                                                                */}
      {/* ========================================================================= */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t text-xs">
          <span className="text-muted-foreground text-center sm:text-left">
            Showing <span className="font-semibold text-foreground">{paginatedProblems.length}</span> of{" "}
            <span className="font-semibold text-foreground">{sortedProblems.length}</span> questions
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPageClamped === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border font-medium bg-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
            >
              Previous
            </button>

            <span className="text-muted-foreground px-2 whitespace-nowrap">
              Page {currentPageClamped} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPageClamped === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border font-medium bg-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. & 8. ADVANCED FILTER SHEET (DRAWER ON DESKTOP, BOTTOM SHEET ON MOBILE) */}
      {/* ========================================================================= */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={
            isMobile
              ? "max-h-[85vh] rounded-t-2xl p-0 gap-0 border-t flex flex-col"
              : "sm:max-w-md p-0 gap-0 flex flex-col"
          }
        >
          {/* Header */}
          <SheetHeader className="px-5 py-4 border-b border-border/80 bg-muted/20 shrink-0">
            <div className="flex items-center justify-between pr-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-primary" />
                <SheetTitle className="text-base font-bold">Filters</SheetTitle>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
            </div>
            <SheetDescription className="text-xs text-muted-foreground mt-0.5">
              Refine questions by difficulty, time range, topics, platform, and status
            </SheetDescription>
          </SheetHeader>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar text-xs">
            {/* Filter Section 1: Difficulty */}
            <div className="space-y-2">
              <label className="font-semibold text-foreground text-xs uppercase tracking-wider block">
                Difficulty
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: "ALL", label: "All" },
                  { id: "EASY", label: "Easy" },
                  { id: "MEDIUM", label: "Medium" },
                  { id: "HARD", label: "Hard" },
                ].map((diff) => (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setDifficultyFilter(diff.id)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                      difficultyFilter === diff.id
                        ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                        : "bg-card hover:bg-muted text-foreground border-border"
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Section 2: Time Range */}
            <div className="space-y-2">
              <label className="font-semibold text-foreground text-xs uppercase tracking-wider block">
                Time Range
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "ALL", label: "All Time", count: problems.length },
                  { id: "THIRTY_DAYS", label: "Past 30 Days", count: thirtyDaysCount },
                  { id: "THREE_MONTHS", label: "Past 3 Months", count: threeMonthsCount },
                  { id: "SIX_MONTHS", label: "Past 6 Months", count: sixMonthsCount },
                  { id: "MORE_THAN_SIX_MONTHS", label: "Past Year (6+ Mo)", count: moreThanSixMonthsCount },
                ].map((tf) => (
                  <button
                    key={tf.id}
                    type="button"
                    onClick={() => setTimeframeFilter(tf.id)}
                    className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                      timeframeFilter === tf.id
                        ? "bg-primary/10 border-primary text-primary font-bold shadow-2xs"
                        : "bg-card hover:bg-muted text-foreground border-border"
                    }`}
                  >
                    <span>{tf.label}</span>
                    <span className="text-[10px] opacity-70 font-mono">({tf.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Section 3: Question Source */}
            <div className="space-y-2">
              <label className="font-semibold text-foreground text-xs uppercase tracking-wider block">
                Question Source
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "ALL", label: "All", count: problems.length },
                  { id: "CURATED", label: "Curated", count: curatedCount },
                  { id: "COMMUNITY", label: "Community", count: communityCount },
                ].map((src) => (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => setSourceFilter(src.id as typeof sourceFilter)}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                      sourceFilter === src.id
                        ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                        : "bg-card hover:bg-muted text-foreground border-border"
                    }`}
                  >
                    <div>{src.label}</div>
                    <div className="text-[10px] opacity-80 font-mono font-normal">({src.count})</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Section 4: Solved Status */}
            <div className="space-y-2">
              <label className="font-semibold text-foreground text-xs uppercase tracking-wider block">
                Solved Status
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "ALL", label: "All", count: problems.length },
                  { id: "SOLVED", label: "Solved", count: solvedCount },
                  { id: "UNSOLVED", label: "Unsolved", count: problems.length - solvedCount },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatusFilter(st.id as typeof statusFilter)}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                      statusFilter === st.id
                        ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                        : "bg-card hover:bg-muted text-foreground border-border"
                    }`}
                  >
                    <div>{st.label}</div>
                    <div className="text-[10px] opacity-80 font-mono font-normal">({st.count})</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Section 5: Platform */}
            {availablePlatforms.length > 1 && (
              <div className="space-y-2">
                <label className="font-semibold text-foreground text-xs uppercase tracking-wider block">
                  Platform
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPlatformFilter("ALL")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      platformFilter === "ALL"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:bg-muted text-foreground border-border"
                    }`}
                  >
                    All Platforms
                  </button>
                  {availablePlatforms.map((plat) => {
                    const info = getPlatformBadge(plat as CodingPlatformType);
                    const count = problems.filter((p) => p.platform === plat).length;
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setPlatformFilter(plat)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          platformFilter === plat
                            ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                            : "bg-card hover:bg-muted text-foreground border-border"
                        }`}
                      >
                        <CodingPlatformIcon platform={plat as CodingPlatformType} className="size-3.5" />
                        <span>{info.label}</span>
                        <span className="text-[10px] font-mono opacity-80">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter Section 6: Topics (Searchable multi-select) */}
            <div className="space-y-2 pt-1 border-t border-border/70">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-foreground text-xs uppercase tracking-wider">
                  Topics ({allTopicsWithCounts.length})
                </label>
                {selectedTopics.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedTopics([])}
                    className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Clear topics ({selectedTopics.length})
                  </button>
                )}
              </div>

              {/* Topic search inside sheet */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={filterTopicSearch}
                  onChange={(e) => setFilterTopicSearch(e.target.value)}
                  placeholder="Filter topic tags..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-border bg-background text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {filterTopicSearch && (
                  <button
                    type="button"
                    onClick={() => setFilterTopicSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>

              {/* Topic pills list */}
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                {allTopicsWithCounts
                  .filter(({ topic }) =>
                    topic.toLowerCase().includes(filterTopicSearch.toLowerCase().trim())
                  )
                  .map(({ topic, count }) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary font-semibold shadow-2xs"
                            : "bg-card hover:bg-muted text-foreground border-border"
                        }`}
                      >
                        <span>{topic}</span>
                        <span
                          className={`text-[10px] font-mono ${
                            isSelected ? "text-primary-foreground/90 font-bold" : "text-muted-foreground"
                          }`}
                        >
                          ({count})
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <SheetFooter className="p-4 border-t border-border/80 bg-card shrink-0 flex flex-row items-center justify-between gap-3">
            <button
              type="button"
              disabled={activeFilterCount === 0}
              onClick={resetAllFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Clear All
            </button>

            <SheetClose
              render={
                <button
                  type="button"
                  className="flex-1 py-2 px-4 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs cursor-pointer text-center"
                />
              }
            >
              Apply Filters ({filteredProblems.length})
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
