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
  let allCompaniesRaw: { id: number; name: string; slug: string; _count: { problems: number } }[] = [];
  try {
    allCompaniesRaw = await withDbRetry(() =>
      prisma.company.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { problems: true } },
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
    problemCount: c._count.problems,
  }));

  // Determine active company slug (default to "google" or first available company)
  const activeSlug = selectedSlugParam || sidebarCompanies[0]?.slug || "google";
  let activeCompany: { id: number; name: string; slug: string; _count: { problems: number } } | null = null;
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
      _count: { problems: 0 },
    };
  }

  // 2. Fetch problems for active company
  let rawProblems: RawProblemEntry[] = [];
  try {
    rawProblems = (await findProblemsForCompany(activeCompany.id, {
      page: 1,
      limit: 1000,
      sort: "title",
      order: "asc",
    })) as unknown as RawProblemEntry[];
  } catch (err) {
    console.warn("Failed to fetch problems for company in dashboard:", err);
  }

  const problems: ProblemItem[] = rawProblems.map((rp) => ({
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
  }));

  return (
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
        {/* Header with Breadcrumb & Sidebar Toggle */}
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur-md px-4 sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden sm:inline-flex">
                <BreadcrumbLink render={<Link href="/" />}>CodeCraft</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:inline-block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-primary">
                  {activeCompany.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1.5 font-medium cursor-pointer shadow-2xs hover:bg-muted">
                <ArrowLeft className="size-3.5" />
                <span>Back</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Problem Explorer Box Format Content - Expands full width */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-full transition-all duration-300">
          <CompanyProblemGrid
            problems={problems}
            companyName={activeCompany.name}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
