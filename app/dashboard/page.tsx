import { KodePrepSidebar } from "@/components/kodeprep-sidebar";
import { CompanyProblemGrid } from "@/components/company-problem-grid";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { findCompanyBySlug, findProblemsForCompany } from "@/lib/repositories/company.repository";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { ProblemItem } from "@/types/problem";
import Link from "next/link";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Company Interview Dashboard — CodeCraft",
  description: "Browse LeetCode interview questions by FAANG, HFT, Service-based, and Product companies.",
};

import { NavbarSearch } from "@/components/navbar-search";
import { NavbarShareButton } from "@/components/navbar-share-button";
import { TargetCompaniesBar } from "@/components/target-companies-bar";
import { AuthGuard } from "@/components/auth-guard";

interface PageProps {
  searchParams: Promise<{
    company?: string;
  }>;
}

interface RawTopicItem {
  topic: { name: string };
}

interface RawCompanyItem {
  company: { name: string; slug: string };
}

interface RawProblemEntry {
  timeframe?: string | null;
  problem: {
    id: number;
    leetcodeNumber?: number | null;
    title: string;
    slug: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    leetcodeUrl: string;
    topics: RawTopicItem[];
    companies?: RawCompanyItem[];
  };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { company: selectedSlugParam } = await searchParams;

  // 1. Fetch all companies for sidebar
  let allCompaniesRaw: { id: number; name: string; slug: string; _count: { problems: number; communityProblems?: number } }[] = [];
  try {
    allCompaniesRaw = await withDbRetry(() =>
      prisma.company.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { problems: true, communityProblems: true } },
        },
        orderBy: { problems: { _count: "desc" } },
      })
    );
  } catch (err) {
    console.warn("Failed to fetch sidebar companies in dashboard:", err);
  }

  const sidebarCompanies = allCompaniesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    problemCount: (c._count.problems ?? 0) + (c._count.communityProblems ?? 0),
  }));

  // Determine active company slug (default to "google" or first available company)
  const activeSlug = selectedSlugParam || sidebarCompanies[0]?.slug || "google";
  let activeCompany: { id: number; name: string; slug: string; _count: { problems: number; communityProblems?: number } } | null = null;
  try {
    activeCompany = await findCompanyBySlug(activeSlug);
  } catch (err) {
    console.warn("Failed to fetch active company by slug:", err);
  }

  if (!activeCompany) {
    // Fallback if DB lookup missed
    activeCompany = {
      id: 1,
      name: activeSlug.charAt(0).toUpperCase() + activeSlug.slice(1),
      slug: activeSlug,
      _count: { problems: 0, communityProblems: 0 },
    };
  }

  // 2. Fetch standard problems & crowdsourced community problems for active company
  let rawProblems: RawProblemEntry[] = [];
  let communityProblemsRaw: Array<{
    id: number;
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    problemUrl: string | null;
    topics: string[];
    platform: import("@/types/problem").CodingPlatformType;
    roundType: string;
    interviewMonth?: string | null;
    interviewYear?: number | null;
    timeframe?: string | null;
    notes: string | null;
    upvotes: number;
    company?: { name: string; slug: string };
    user?: { displayName: string | null; photoUrl: string | null; email?: string | null } | null;
  }> = [];

  try {
    const [fetchedProblems, fetchedCommunity] = await Promise.all([
      findProblemsForCompany(activeCompany.id, {
        page: 1,
        limit: 1000,
        sort: "title",
        order: "asc",
      }),
      withDbRetry(() =>
        prisma.communityProblem.findMany({
          where: { companyId: activeCompany!.id },
          orderBy: [{ upvotes: "desc" }, { createdAt: "desc" }],
          include: {
            company: { select: { name: true, slug: true } },
            user: { select: { displayName: true, photoUrl: true, email: true } },
          },
        })
      ),
    ]);
    rawProblems = fetchedProblems as unknown as RawProblemEntry[];
    communityProblemsRaw = fetchedCommunity as typeof communityProblemsRaw;
  } catch (err) {
    console.warn("Failed to fetch problems for company in dashboard:", err);
  }

  // Find other companies that also had the same community questions reported
  const titleToOtherCompaniesMap = new Map<string, Array<{ name: string; slug: string }>>();
  if (communityProblemsRaw.length > 0) {
    try {
      const titles = communityProblemsRaw.map((c) => c.title.toLowerCase().trim());
      const otherMatches = await withDbRetry(() =>
        prisma.communityProblem.findMany({
          where: {
            title: { in: titles, mode: "insensitive" },
          },
          select: {
            title: true,
            company: { select: { name: true, slug: true } },
          },
        })
      );
      for (const m of otherMatches) {
        if (!m.company) continue;
        const key = m.title.toLowerCase().trim();
        const list = titleToOtherCompaniesMap.get(key) || [];
        if (!list.some((existing) => existing.slug === m.company.slug)) {
          list.push(m.company);
        }
        titleToOtherCompaniesMap.set(key, list);
      }
    } catch (e) {
      console.warn("Failed to fetch cross-company community matches:", e);
    }
  }

  const standardProblems: ProblemItem[] = rawProblems.map((rp) => ({
    id: rp.problem.id,
    leetcodeNumber: rp.problem.leetcodeNumber,
    title: rp.problem.title,
    slug: rp.problem.slug,
    difficulty: rp.problem.difficulty,
    leetcodeUrl: rp.problem.leetcodeUrl,
    topics: rp.problem.topics.map((t) => t.topic.name),
    timeframe: rp.timeframe || "ALL",
    companiesAsking: rp.problem.companies ? rp.problem.companies.map((c) => ({
      name: c.company.name,
      slug: c.company.slug,
    })) : [],
    platform: "LEETCODE",
    isCommunity: false,
  }));

  const communityProblems: ProblemItem[] = communityProblemsRaw.map((cp) => {
    const key = cp.title.toLowerCase().trim();
    const otherCompanies = titleToOtherCompaniesMap.get(key) || [];
    const activeSlug = cp.company?.slug || activeCompany.slug;
    const activeName = cp.company?.name || activeCompany.name;

    const companiesAskingList = [
      { name: activeName, slug: activeSlug },
      ...otherCompanies.filter((c) => c.slug !== activeSlug),
    ];

    const interviewDate = cp.interviewMonth && cp.interviewYear
      ? `${cp.interviewMonth} ${cp.interviewYear}`
      : cp.interviewMonth || (cp.interviewYear ? String(cp.interviewYear) : null);

    return {
      id: cp.id + 1_000_000, // Distinct key range to prevent collision with standard problem IDs
      title: cp.title,
      slug: `community-${cp.id}`,
      difficulty: cp.difficulty,
      leetcodeUrl: cp.problemUrl || "#",
      topics: Array.isArray(cp.topics) ? cp.topics : [],
      companiesAsking: companiesAskingList,
      platform: cp.platform,
      isCommunity: true,
      roundType: cp.roundType,
      timeframe: cp.timeframe || "ALL",
      interviewMonth: cp.interviewMonth,
      interviewYear: cp.interviewYear,
      interviewDate,
      notes: cp.notes,
      upvotes: cp.upvotes,
      submittedBy: cp.user
        ? {
            displayName:
              cp.user.displayName ||
              (cp.user.email ? cp.user.email.split("@")[0] : "Community Member"),
            photoUrl: cp.user.photoUrl,
          }
        : null,
    };
  });

  // Combined problems: Community-reported interview questions first, then standard list
  const problems: ProblemItem[] = [...communityProblems, ...standardProblems];

  return (
    <AuthGuard>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "18rem",
          } as React.CSSProperties
        }
      >
      {/* Shadcn Custom Sidebar with Categories & Search */}
      <KodePrepSidebar companies={sidebarCompanies} selectedCompanySlug={activeCompany.slug} />

      {/* Main Content Area */}
      <SidebarInset>
        {/* Header with Breadcrumb, Sidebar Toggle, Navbar Search & Back */}
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur-md px-3 sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-1 sm:mr-2 h-4" />

            <Breadcrumb className="min-w-0">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:inline-flex">
                  <BreadcrumbLink render={<Link href="/" />}>CodeCraft</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:inline-block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-primary max-w-[80px] xs:max-w-[120px] sm:max-w-xs truncate text-xs sm:text-sm">
                    {activeCompany.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto shrink-0">
            {/* Quick Search across all 694 companies in Navbar */}
            <NavbarSearch
              companies={sidebarCompanies}
              currentCompanySlug={activeCompany.slug}
            />

            {/* Share Interview Question Button */}
            <NavbarShareButton
              companySlug={activeCompany.slug}
              companyName={activeCompany.name}
            />

            {/* GitHub Star Repository Button */}
            <a
              href="https://github.com/neutron420/CodePrep"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-lg border border-border bg-card/70 hover:bg-muted text-foreground text-xs font-semibold transition-all shadow-2xs hover:border-border/80 group cursor-pointer"
              title="Star CodeCraft on GitHub"
            >
              <svg className="size-3.5 fill-foreground shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="hidden sm:inline">Star</span>
              <Star className="size-3 text-amber-500 fill-amber-500 shrink-0 group-hover:rotate-12 transition-transform" />
            </a>
          </div>
        </header>

        {/* Problem Explorer Box Format Content - Expands full width with optimized mobile padding */}
        <div className="flex-1 p-2.5 sm:p-5 lg:p-8 w-full max-w-full transition-all duration-300 space-y-3.5 sm:space-y-4">
          {/* Target Companies Quick-Switch Ribbon */}
          <TargetCompaniesBar
            companies={sidebarCompanies}
            activeCompanySlug={activeCompany.slug}
          />

          <CompanyProblemGrid
            problems={problems}
            companyName={activeCompany.name}
            companySlug={activeCompany.slug}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
    </AuthGuard>
  );
}
