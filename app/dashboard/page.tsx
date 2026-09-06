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
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Company Interview Dashboard — CodeCraft",
  description: "Browse LeetCode interview questions by FAANG, HFT, Service-based, and Product companies.",
};

import { NavbarSearch } from "@/components/navbar-search";
import { NavbarShareButton } from "@/components/navbar-share-button";
import { TargetCompaniesBar } from "@/components/target-companies-bar";
import { UserNav } from "@/components/user-nav";
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
  problem: {
    id: number;
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
    notes: string | null;
    upvotes: number;
    company?: { name: string; slug: string };
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
          },
        })
      ),
    ]);
    rawProblems = fetchedProblems as unknown as RawProblemEntry[];
    communityProblemsRaw = fetchedCommunity as typeof communityProblemsRaw;
  } catch (err) {
    console.warn("Failed to fetch problems for company in dashboard:", err);
  }

  const standardProblems: ProblemItem[] = rawProblems.map((rp) => ({
    id: rp.problem.id,
    title: rp.problem.title,
    slug: rp.problem.slug,
    difficulty: rp.problem.difficulty,
    leetcodeUrl: rp.problem.leetcodeUrl,
    topics: rp.problem.topics.map((t) => t.topic.name),
    companiesAsking: rp.problem.companies ? rp.problem.companies.map((c) => ({
      name: c.company.name,
      slug: c.company.slug,
    })) : [],
    platform: "LEETCODE",
    isCommunity: false,
  }));

  const communityProblems: ProblemItem[] = communityProblemsRaw.map((cp) => ({
    id: cp.id + 1_000_000, // Distinct key range to prevent collision with standard problem IDs
    title: cp.title,
    slug: `community-${cp.id}`,
    difficulty: cp.difficulty,
    leetcodeUrl: cp.problemUrl || "#",
    topics: Array.isArray(cp.topics) ? cp.topics : [],
    companiesAsking: [
      {
        name: cp.company?.name || activeCompany.name,
        slug: cp.company?.slug || activeCompany.slug,
      },
    ],
    platform: cp.platform,
    isCommunity: true,
    roundType: cp.roundType,
    notes: cp.notes,
    upvotes: cp.upvotes,
  }));

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

            {/* Authentication & User Profile */}
            <UserNav />

            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1.5 font-medium cursor-pointer shadow-2xs hover:bg-muted text-xs h-8 px-2 sm:px-3">
                <ArrowLeft className="size-3.5" />
                <span className="hidden xs:inline">Back</span>
              </Button>
            </Link>
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
