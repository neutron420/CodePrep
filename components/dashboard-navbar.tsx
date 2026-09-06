"use client";

import { useSearchParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NavbarSearch } from "@/components/navbar-search";
import { NavbarShareButton } from "@/components/navbar-share-button";
import { Star } from "lucide-react";
import Link from "next/link";
import { CompanySidebarItem } from "@/components/kodeprep-sidebar";

interface DashboardNavbarProps {
  companies: CompanySidebarItem[];
}

export function DashboardNavbar({ companies }: DashboardNavbarProps) {
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("company") || companies[0]?.slug || "google";
  const foundCompany = companies.find((c) => c.slug === activeSlug);
  const activeCompanyName = foundCompany?.name || (activeSlug.charAt(0).toUpperCase() + activeSlug.slice(1));

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur-md px-3 sm:px-6">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <SidebarTrigger className="-ml-1" />

        <Breadcrumb className="min-w-0">
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:inline-flex">
              <BreadcrumbLink render={<Link href="/" />}>CodeCraft</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:inline-block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-primary max-w-[80px] xs:max-w-[120px] sm:max-w-xs truncate text-xs sm:text-sm">
                {activeCompanyName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto shrink-0">
        {/* Quick Search across all companies in Navbar */}
        <NavbarSearch
          companies={companies}
          currentCompanySlug={activeSlug}
        />

        {/* Share Interview Question Button */}
        <NavbarShareButton
          companySlug={activeSlug}
          companyName={activeCompanyName}
        />

        {/* GitHub Star Repository Button */}
        <a
          href="https://github.com/neutron420/CodeCraft"
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
  );
}
