import { KodePrepSidebar } from "@/components/kodeprep-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { AuthGuard } from "@/components/auth-guard";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let allCompaniesRaw: {
    id: number;
    name: string;
    slug: string;
    _count: { problems: number; communityProblems?: number };
  }[] = [];

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
    console.warn("Failed to fetch sidebar companies in dashboard layout:", err);
  }

  const sidebarCompanies = allCompaniesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    problemCount: (c._count.problems ?? 0) + (c._count.communityProblems ?? 0),
  }));

  return (
    <AuthGuard>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "18rem",
          } as React.CSSProperties
        }
      >
        <KodePrepSidebar companies={sidebarCompanies} selectedCompanySlug="google" />
        <SidebarInset>
          <DashboardNavbar companies={sidebarCompanies} />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
