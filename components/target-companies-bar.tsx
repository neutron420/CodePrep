"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Star, ChevronRight } from "lucide-react";
import { CompanyLogo } from "@/components/company-logo";
import { CompanyTooltip } from "@/components/company-tooltip";
import { useTargetCompanies } from "@/lib/hooks/use-target-companies";

export interface TargetBarCompany {
  id: number;
  name: string;
  slug: string;
  problemCount: number;
}

interface TargetCompaniesBarProps {
  companies: TargetBarCompany[];
  activeCompanySlug: string;
}

export function TargetCompaniesBar({
  companies,
  activeCompanySlug,
}: TargetCompaniesBarProps) {
  const router = useRouter();
  const { targets } = useTargetCompanies();

  // Index companies by slug for instant lookups
  const targetCompanies = useMemo(() => {
    const map = new Map<string, TargetBarCompany>();
    companies.forEach((c) => map.set(c.slug.toLowerCase(), c));

    return targets
      .map((slug) => map.get(slug.toLowerCase()))
      .filter((c): c is TargetBarCompany => Boolean(c));
  }, [companies, targets]);

  if (targetCompanies.length === 0) return null;

  return (
    <div className="w-full flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-card border shadow-2xs overflow-x-auto no-scrollbar">
      {/* Label Badge */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 text-xs font-bold">
        <Star className="size-3.5 fill-amber-400 text-amber-500" />
        <span className="font-sans font-bold whitespace-nowrap">My Targets</span>
        <span className="text-[10px] font-mono px-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
          {targetCompanies.length}
        </span>
      </div>

      <ChevronRight className="size-3.5 text-muted-foreground/50 shrink-0" />

      {/* Horizontal List of Target Companies */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        {targetCompanies.map((company) => {
          const isActive = company.slug.toLowerCase() === activeCompanySlug.toLowerCase();

          return (
            <CompanyTooltip
              key={company.id}
              name={company.name}
              problemCount={company.problemCount}
              side="bottom"
            >
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("company-switch-start", { detail: company.slug }));
                  }
                  router.push(`/dashboard?company=${company.slug}`);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer shrink-0 border ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                    : "bg-muted/40 hover:bg-muted text-foreground border-border/70 hover:border-border"
                }`}
              >
                <CompanyLogo
                  name={company.name}
                  className="size-4 rounded text-[9px] shrink-0"
                />
                <span className="font-medium truncate max-w-[110px] sm:max-w-[140px]">
                  {company.name}
                </span>
                <span
                  className={`text-[10px] font-mono ${
                    isActive
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  ({company.problemCount})
                </span>
              </button>
            </CompanyTooltip>
          );
        })}
      </div>
    </div>
  );
}
