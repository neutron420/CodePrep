"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "sonner";
import {
  Plus,
  Users2,
  Code2,
  Link as LinkIcon,
  Check,
  Building2,
  Tag,
  BookOpen,
  Loader2,
  X,
  Lock,
  ChevronDown,
  Search,
  AlertCircle,
} from "lucide-react";
import { CodingPlatformType } from "@/types/problem";
import { CodingPlatformIcon } from "@/components/coding-platform-icon";
import { CompanyLogo } from "@/components/company-logo";

interface SubmitQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companySlug?: string;
  companyName?: string;
  onSuccess?: () => void;
}

interface PlatformOption {
  id: CodingPlatformType;
  label: string;
  badge: string;
  colorClass: string;
}

interface CompanyOption {
  slug: string;
  name: string;
  problemCount?: number;
}

const PLATFORMS: PlatformOption[] = [
  { id: "LEETCODE", label: "LeetCode", badge: "LC", colorClass: "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10" },
  { id: "GEEKSFORGEEKS", label: "GeeksforGeeks", badge: "GFG", colorClass: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
  { id: "CODECHEF", label: "CodeChef", badge: "CC", colorClass: "border-yellow-600/40 text-yellow-700 dark:text-yellow-400 bg-yellow-600/10" },
  { id: "CODEFORCES", label: "Codeforces", badge: "CF", colorClass: "border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10" },
  { id: "ATCODER", label: "AtCoder", badge: "AC", colorClass: "border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10" },
  { id: "HACKERRANK", label: "HackerRank", badge: "HR", colorClass: "border-green-500/40 text-green-600 dark:text-green-400 bg-green-500/10" },
  { id: "CODESTUDIO", label: "CodeStudio", badge: "CS", colorClass: "border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/10" },
  { id: "HACKEREARTH", label: "HackerEarth", badge: "HE", colorClass: "border-indigo-500/40 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10" },
  { id: "INTERVIEWBIT", label: "InterviewBit", badge: "IB", colorClass: "border-teal-500/40 text-teal-600 dark:text-teal-400 bg-teal-500/10" },
  { id: "CUSTOM", label: "In-Interview / Direct", badge: "Custom", colorClass: "border-zinc-500/40 text-zinc-600 dark:text-zinc-400 bg-zinc-500/10" },
];

const ALLOWED_PLATFORM_HOSTS = [
  "leetcode.com",
  "leetcode.cn",
  "geeksforgeeks.org",
  "codechef.com",
  "codeforces.com",
  "atcoder.jp",
  "hackerrank.com",
  "hackerearth.com",
  "naukri.com",
  "codingninjas.com",
  "interviewbit.com",
];

const COMMON_TOPICS = [
  "Array",
  "String",
  "Dynamic Programming",
  "BFS / DFS",
  "Trees",
  "Graphs",
  "Two Pointers",
  "Binary Search",
  "Greedy",
  "Trie",
  "Sliding Window",
  "System Design",
];

const ROUND_OPTIONS = [
  "Online Assessment (OA)",
  "Technical Round 1",
  "Technical Round 2",
  "Managerial / HR",
];

// Security layer: Validate, sanitize, and auto-detect coding platform from URL
function validateAndDetectUrl(inputUrl: string): {
  isValid: boolean;
  sanitizedUrl: string;
  platform?: CodingPlatformType;
  extractedTitle?: string;
  errorMessage?: string;
} {
  const trimmed = inputUrl.trim();
  if (!trimmed) {
    return { isValid: true, sanitizedUrl: "" };
  }

  // Prepend https:// if user pasted raw domain (e.g. leetcode.com/problems/...)
  let fullUrl = trimmed;
  if (!/^https?:\/\//i.test(fullUrl)) {
    fullUrl = "https://" + fullUrl;
  }

  try {
    const urlObj = new URL(fullUrl);

    // Protocol check - strictly reject javascript:, data:, file:, vbscript:
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
      return {
        isValid: false,
        sanitizedUrl: "",
        errorMessage: "Only secure http:// and https:// URLs are allowed.",
      };
    }

    const host = urlObj.hostname.toLowerCase();

    // Security check: Block private/local IP addresses or localhost to prevent SSRF
    if (
      host === "localhost" ||
      /^(\d{1,3}\.){3}\d{1,3}$/.test(host) ||
      host.endsWith(".local") ||
      host.endsWith(".internal")
    ) {
      return {
        isValid: false,
        sanitizedUrl: "",
        errorMessage: "Internal or private network addresses are blocked.",
      };
    }

    // Check against authorized platforms
    const isPlatformHost = ALLOWED_PLATFORM_HOSTS.some(
      (h) => host === h || host.endsWith("." + h)
    );

    if (!isPlatformHost) {
      return {
        isValid: false,
        sanitizedUrl: "",
        errorMessage: "Please paste a link from a supported platform (LeetCode, GFG, CodeChef, Codeforces, HackerRank, etc.).",
      };
    }

    let detectedPlatform: CodingPlatformType = "CUSTOM";
    let extractedTitle = "";

    if (host.includes("leetcode.com") || host.includes("leetcode.cn")) {
      detectedPlatform = "LEETCODE";
      const match = urlObj.pathname.match(/\/problems\/([^/]+)/i);
      if (match && match[1]) {
        extractedTitle = match[1]
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      }
    } else if (host.includes("geeksforgeeks.org")) {
      detectedPlatform = "GEEKSFORGEEKS";
      const match = urlObj.pathname.match(/\/problems\/([^/]+)/i);
      if (match && match[1]) {
        const clean = match[1].replace(/-\d{6,}$/, "");
        extractedTitle = clean
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      }
    } else if (host.includes("codechef.com")) {
      detectedPlatform = "CODECHEF";
      const match = urlObj.pathname.match(/\/problems\/([^/]+)/i);
      if (match && match[1]) {
        extractedTitle = match[1].toUpperCase();
      }
    } else if (host.includes("codeforces.com")) {
      detectedPlatform = "CODEFORCES";
      const match = urlObj.pathname.match(/\/problemset\/problem\/([^/]+)\/([^/]+)/i);
      if (match && match[1] && match[2]) {
        extractedTitle = `Problem ${match[1]}${match[2].toUpperCase()}`;
      }
    } else if (host.includes("atcoder.jp")) {
      detectedPlatform = "ATCODER";
      const match = urlObj.pathname.match(/\/tasks\/([^/]+)/i);
      if (match && match[1]) {
        extractedTitle = match[1].toUpperCase().replace(/_/g, " ");
      }
    } else if (host.includes("hackerrank.com")) {
      detectedPlatform = "HACKERRANK";
      const match = urlObj.pathname.match(/\/challenges\/([^/]+)/i);
      if (match && match[1]) {
        extractedTitle = match[1]
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      }
    } else if (host.includes("naukri.com") || host.includes("codingninjas.com")) {
      detectedPlatform = "CODESTUDIO";
      const match = urlObj.pathname.match(/\/problems\/([^/]+)/i);
      if (match && match[1]) {
        extractedTitle = match[1]
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      }
    } else if (host.includes("hackerearth.com")) {
      detectedPlatform = "HACKEREARTH";
      const match = urlObj.pathname.match(/\/algorithm\/([^/]+)/i);
      if (match && match[1]) {
        extractedTitle = match[1]
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      }
    } else if (host.includes("interviewbit.com")) {
      detectedPlatform = "INTERVIEWBIT";
      const match = urlObj.pathname.match(/\/problems\/([^/]+)/i);
      if (match && match[1]) {
        extractedTitle = match[1]
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      }
    }

    // Strip tracking parameters (utm_source, ref, etc.)
    urlObj.searchParams.delete("utm_source");
    urlObj.searchParams.delete("utm_medium");
    urlObj.searchParams.delete("utm_campaign");
    urlObj.searchParams.delete("ref");

    return {
      isValid: true,
      sanitizedUrl: urlObj.toString(),
      platform: detectedPlatform,
      extractedTitle,
    };
  } catch {
    return {
      isValid: false,
      sanitizedUrl: "",
      errorMessage: "Please enter a valid web URL.",
    };
  }
}

export function SubmitQuestionDialog({
  open,
  onOpenChange,
  companySlug = "",
  companyName = "",
  onSuccess,
}: SubmitQuestionDialogProps) {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Company selection state
  const [selectedCompanySlug, setSelectedCompanySlug] = useState(companySlug);
  const [selectedCompanyName, setSelectedCompanyName] = useState(companyName);
  const [companySearch, setCompanySearch] = useState("");
  const [companyList, setCompanyList] = useState<CompanyOption[]>([]);
  const [isCompanyLoading, setIsCompanyLoading] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  // Platform selection state
  const [platform, setPlatform] = useState<CodingPlatformType>("LEETCODE");
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [problemUrl, setProblemUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [roundType, setRoundType] = useState("Online Assessment (OA)");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["Array"]);
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [notes, setNotes] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Sync state when props change without effect setState cascade
  const [prevProps, setPrevProps] = useState({ companySlug, companyName, open });
  if (
    open !== prevProps.open ||
    companySlug !== prevProps.companySlug ||
    companyName !== prevProps.companyName
  ) {
    setPrevProps({ companySlug, companyName, open });
    if (companySlug) setSelectedCompanySlug(companySlug);
    if (companyName) setSelectedCompanyName(companyName);
  }

  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const platformDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCompanyDropdownOpen(false);
      }
      if (
        platformDropdownRef.current &&
        !platformDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPlatformDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch companies for searchable dropdown
  useEffect(() => {
    if (!open) return;
    let active = true;

    const fetchCompanies = async () => {
      setIsCompanyLoading(true);
      try {
        const query = companySearch.trim();
        const url = query
          ? `/api/companies?search=${encodeURIComponent(query)}&limit=30`
          : `/api/companies?limit=30`;
        const res = await fetch(url);
        const json = await res.json();
        if (active && json.data) {
          setCompanyList(
            json.data.map((c: { slug: string; name: string; problemCount?: number }) => ({
              slug: c.slug,
              name: c.name,
              problemCount: c.problemCount,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load companies:", err);
      } finally {
        if (active) setIsCompanyLoading(false);
      }
    };

    const timer = setTimeout(fetchCompanies, companySearch ? 200 : 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [companySearch, open]);

  // Handle URL change with security layer & auto-detection
  const handleUrlChange = (value: string) => {
    setProblemUrl(value);
    setUrlError("");

    if (!value.trim()) return;

    const validation = validateAndDetectUrl(value);

    if (!validation.isValid) {
      setUrlError(validation.errorMessage || "Invalid URL.");
      return;
    }

    if (validation.platform) {
      setPlatform(validation.platform);

      // Auto-populate title if empty and extracted title is clean
      if (!title.trim() && validation.extractedTitle) {
        setTitle(validation.extractedTitle);
      }
    }
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const addCustomTopic = () => {
    const trimmed = customTopicInput.trim();
    if (trimmed && !selectedTopics.includes(trimmed)) {
      setSelectedTopics((prev) => [...prev, trimmed]);
      setCustomTopicInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCompanySlug) {
      toast.error("Please select the company that asked this question");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a problem title");
      return;
    }

    if (problemUrl.trim()) {
      const check = validateAndDetectUrl(problemUrl);
      if (!check.isValid) {
        toast.error(check.errorMessage || "Please enter a valid problem link");
        setUrlError(check.errorMessage || "Invalid link");
        return;
      }
    }

    if (selectedTopics.length === 0) {
      toast.error("Please select at least one topic tag");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companySlug: selectedCompanySlug,
            platform,
            title: title.trim(),
            problemUrl: problemUrl.trim() || null,
            difficulty,
            roundType,
            topics: selectedTopics,
            notes: notes.trim() || null,
            userId: isAnonymous ? null : user?.uid || null,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to submit question");
          return;
        }

        // Auto-mark as verified in localStorage for the submitter
        if (data.submission?.id) {
          try {
            const raw = localStorage.getItem("codeprep_upvoted_problems");
            const arr: number[] = raw ? JSON.parse(raw) : [];
            const set = new Set(arr);
            set.add(data.submission.id);
            set.add(data.submission.id + 1_000_000);
            localStorage.setItem("codeprep_upvoted_problems", JSON.stringify(Array.from(set)));
          } catch (e) {
            console.error(e);
          }
        }

        if (data.isMerged) {
          toast.success("Question verified & updated (+1)!", {
            description: `This question was already reported for ${selectedCompanyName || selectedCompanySlug}. We merged it and added your verification (+1 upvote) to avoid duplicate questions!`,
          });
        } else if (data.isExistingCurated) {
          toast.info("Already in curated problem list!", {
            description: data.message || `This problem is already in the official problem set for ${selectedCompanyName || selectedCompanySlug}.`,
          });
        } else {
          toast.success(`Question added for ${selectedCompanyName || selectedCompanySlug}!`, {
            description: "Other students can now view, practice, and verify it.",
          });
        }

        // Reset fields
        setTitle("");
        setProblemUrl("");
        setNotes("");
        setIsCompanyDropdownOpen(false);
        setIsPlatformDropdownOpen(false);
        onOpenChange(false);
        onSuccess?.();
      } catch (err) {
        console.error("Submission error:", err);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  const currentPlatformOption = PLATFORMS.find((p) => p.id === platform) || PLATFORMS[0];

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          setIsCompanyDropdownOpen(false);
          setIsPlatformDropdownOpen(false);
        }
        onOpenChange(val);
      }}
    >
      <DialogContent className="max-w-[480px] w-[94vw] max-h-[85dvh] sm:max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-xl sm:rounded-2xl border-border bg-card shadow-2xl">
        {/* Header - Fixed & Compact */}
        <div className="px-3.5 py-2.5 sm:px-5 sm:py-3.5 border-b border-border/80 bg-muted/20 shrink-0">
          <div className="flex items-center gap-1.5 text-primary font-semibold text-[10px] sm:text-xs tracking-wider uppercase">
            <Users2 className="size-3 sm:size-3.5" />
            <span>Community Question</span>
          </div>
          <DialogTitle className="text-sm sm:text-base font-bold mt-0.5 tracking-tight text-foreground">
            Share Interview Question
          </DialogTitle>
          <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-snug">
            Contribute questions asked in recent technical rounds & assessments
          </DialogDescription>
        </div>

        {/* Scrollable Form Body */}
        <form
          id="submit-question-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-3.5 py-3 sm:px-5 sm:py-4 space-y-2.5 sm:space-y-3.5 no-scrollbar"
        >
          {/* Row 1: Company Selector & Platform Selector Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {/* 1. Searchable Company Dropdown */}
            <div ref={companyDropdownRef} className="space-y-1 relative">
              <label className="text-[11px] sm:text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Building2 className="size-3 sm:size-3.5 text-primary shrink-0" />
                <span>Company <span className="text-rose-500">*</span></span>
              </label>

              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  setIsCompanyDropdownOpen((prev) => !prev);
                  setIsPlatformDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border bg-background hover:bg-muted/40 transition-colors text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-2xs h-9 sm:h-10 ${
                  isCompanyDropdownOpen ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CompanyLogo name={selectedCompanyName || "Company"} className="size-4.5 sm:size-5 rounded shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-foreground truncate">
                    {selectedCompanyName || "Select company..."}
                  </span>
                </div>
                <ChevronDown
                  className={`size-3 sm:size-3.5 text-muted-foreground shrink-0 transition-transform ${
                    isCompanyDropdownOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {/* Searchable Dropdown Menu */}
              {isCompanyDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl p-2 space-y-1.5 animate-in fade-in-50 zoom-in-95 duration-150">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      autoFocus
                      value={companySearch}
                      onChange={(e) => setCompanySearch(e.target.value)}
                      placeholder="Search company (e.g. Google)..."
                      className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {companySearch && (
                      <button
                        type="button"
                        onClick={() => setCompanySearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>

                  {/* Company Results */}
                  <div className="max-h-48 overflow-y-auto space-y-0.5 no-scrollbar">
                    {isCompanyLoading ? (
                      <div className="py-4 flex items-center justify-center text-xs text-muted-foreground gap-2">
                        <Loader2 className="size-3.5 animate-spin text-primary" />
                        <span>Searching companies...</span>
                      </div>
                    ) : companyList.length === 0 ? (
                      <div className="py-4 text-center text-xs text-muted-foreground">
                        No companies found.
                      </div>
                    ) : (
                      companyList.map((c) => {
                        const isSelected = selectedCompanySlug === c.slug;
                        return (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => {
                              setSelectedCompanySlug(c.slug);
                              setSelectedCompanyName(c.name);
                              setIsCompanyDropdownOpen(false);
                              setCompanySearch("");
                            }}
                            className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                              isSelected
                                ? "bg-primary/10 text-primary font-semibold"
                                : "hover:bg-muted text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <CompanyLogo name={c.name} className="size-4.5 rounded shrink-0" />
                              <span className="truncate">{c.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {c.problemCount !== undefined && (
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  {c.problemCount} Qs
                                </span>
                              )}
                              {isSelected && <Check className="size-3 text-primary stroke-[2.5]" />}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Coding Platform Dropdown */}
            <div ref={platformDropdownRef} className="space-y-1 relative">
              <label className="text-[11px] sm:text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Code2 className="size-3 sm:size-3.5 text-primary shrink-0" />
                <span>Coding Platform <span className="text-rose-500">*</span></span>
              </label>

              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  setIsPlatformDropdownOpen((prev) => !prev);
                  setIsCompanyDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border bg-background hover:bg-muted/40 transition-colors text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-2xs h-9 sm:h-10 ${
                  isPlatformDropdownOpen ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CodingPlatformIcon platform={platform} className="size-3.5 sm:size-4 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-foreground truncate">
                    {currentPlatformOption.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${currentPlatformOption.colorClass}`}>
                    {currentPlatformOption.badge}
                  </span>
                  <ChevronDown
                    className={`size-3 sm:size-3.5 text-muted-foreground transition-transform ${
                      isPlatformDropdownOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Platform Dropdown Menu */}
              {isPlatformDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl p-1.5 max-h-56 overflow-y-auto space-y-0.5 no-scrollbar animate-in fade-in-50 zoom-in-95 duration-150">
                  {PLATFORMS.map((p) => {
                    const isSelected = platform === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setPlatform(p.id);
                          setIsPlatformDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                          isSelected
                            ? "bg-primary/10 text-primary font-semibold"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CodingPlatformIcon platform={p.id} className="size-4 shrink-0" />
                          <span className="truncate">{p.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${p.colorClass}`}>
                            {p.badge}
                          </span>
                          {isSelected && <Check className="size-3 text-primary stroke-[2.5]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Problem Title */}
          <div className="space-y-1">
            <label className="text-[11px] sm:text-xs font-semibold text-foreground">
              Problem Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Course Schedule IV or Minimum Swaps"
              className="w-full h-9 sm:h-10 px-3 text-xs sm:text-sm rounded-lg sm:rounded-xl border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          {/* Row 3: Problem URL (with Security Layer & Live Auto-Detection) */}
          <div className="space-y-1">
            <label className="text-[11px] sm:text-xs font-semibold text-foreground flex items-center gap-1.5">
              <LinkIcon className="size-3 text-muted-foreground" />
              <span>Problem Link <span className="text-muted-foreground font-normal text-[10px] sm:text-[11px]">(Optional)</span></span>
            </label>

            <div className="relative">
              <input
                type="url"
                value={problemUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="Paste link (e.g. https://leetcode.com/problems/...)"
                className={`w-full h-9 sm:h-10 px-3 text-xs rounded-lg sm:rounded-xl border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all font-mono text-[11px] sm:text-xs ${
                  urlError
                    ? "border-rose-500/80 focus:ring-rose-500/40 text-rose-600 dark:text-rose-400"
                    : "border-border focus:ring-primary/40 text-foreground"
                }`}
              />
              {problemUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setProblemUrl("");
                    setUrlError("");
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Security Error Alert */}
            {urlError && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                <AlertCircle className="size-3 shrink-0" />
                <span>{urlError}</span>
              </p>
            )}
          </div>

          {/* Row 4: Difficulty & Interview Round (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {/* Difficulty */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-semibold text-foreground">Difficulty</label>
              <div className="grid grid-cols-3 gap-1 p-1 rounded-lg sm:rounded-xl bg-muted/50 border border-border/80 h-9 sm:h-10 items-center">
                {(["EASY", "MEDIUM", "HARD"] as const).map((diff) => {
                  const isSelected = difficulty === diff;
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`h-6 sm:h-7 text-[10px] sm:text-[11px] font-semibold rounded-md sm:rounded-lg transition-all cursor-pointer capitalize flex items-center justify-center ${
                        isSelected
                          ? diff === "EASY"
                            ? "bg-emerald-500 text-white font-bold shadow-xs"
                            : diff === "MEDIUM"
                            ? "bg-amber-500 text-white font-bold shadow-xs"
                            : "bg-rose-500 text-white font-bold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {diff.toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Round Type */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-semibold text-foreground">Interview Round</label>
              <select
                value={roundType}
                onChange={(e) => setRoundType(e.target.value)}
                className="w-full h-9 sm:h-10 px-2.5 sm:px-3 text-[11px] sm:text-xs rounded-lg sm:rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              >
                {ROUND_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Topic Tags */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] sm:text-xs font-semibold text-foreground flex items-center gap-1">
                <Tag className="size-3 text-muted-foreground" />
                <span>Topics <span className="text-rose-500">*</span></span>
              </label>
              <span className="text-[10px] text-muted-foreground">Select all that apply</span>
            </div>

            {/* Quick Toggle Topics */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {COMMON_TOPICS.map((topic) => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`text-[10px] sm:text-[11px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-semibold border-primary shadow-2xs"
                        : "bg-muted/30 hover:bg-muted text-muted-foreground border-border/80"
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>

            {/* Add Custom Topic Input */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTopic();
                  }
                }}
                placeholder="+ Add custom tag..."
                className="flex-1 h-7 sm:h-8 px-2.5 text-[11px] sm:text-xs rounded-lg border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={addCustomTopic}
                className="h-7 sm:h-8 px-2.5 text-[11px] sm:text-xs rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium cursor-pointer border border-border"
              >
                Add
              </button>
            </div>
          </div>

          {/* Row 6: Interview Notes / Constraints (Optional) */}
          <div className="space-y-1">
            <label className="text-[11px] sm:text-xs font-semibold text-foreground flex items-center gap-1">
              <BookOpen className="size-3 text-muted-foreground" />
              <span>Interview Notes & Follow-ups <span className="text-muted-foreground font-normal text-[10px] sm:text-[11px]">(Optional)</span></span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Constraints N <= 10^5, interviewer asked follow-up to optimize space..."
              className="w-full px-2.5 py-1.5 text-[11px] sm:text-xs rounded-lg sm:rounded-xl border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-all leading-relaxed"
            />
          </div>

          {/* Row 7: Anonymous Toggle */}
          <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-muted/30 border border-border/70">
            <div className="flex items-center gap-2">
              <Lock className="size-3.5 text-muted-foreground" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] sm:text-xs font-medium text-foreground">Post Anonymously</span>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground">Do not show your profile name with this question</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="size-3.5 sm:size-4 rounded accent-primary cursor-pointer"
            />
          </div>
        </form>

        {/* Footer - Fixed & Sticky */}
        <div className="px-3.5 py-2 sm:px-4 sm:py-3 border-t border-border bg-muted/20 shrink-0 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="text-[11px] sm:text-xs cursor-pointer h-8 sm:h-9 px-3 sm:px-4 rounded-lg sm:rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="submit-question-form"
            size="sm"
            disabled={isPending || !title.trim()}
            className="text-[11px] sm:text-xs font-semibold cursor-pointer gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 h-8 sm:h-9 px-3 sm:px-4 rounded-lg sm:rounded-xl shadow-xs"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3 sm:size-3.5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Plus className="size-3 sm:size-3.5" />
                <span>Share Question</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
