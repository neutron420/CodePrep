"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Star, CornerDownLeft, Building2 } from "lucide-react";
import { CompanyLogo } from "@/components/company-logo";
import { useTargetCompanies } from "@/lib/hooks/use-target-companies";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

export interface NavbarCompanyItem {
  id: number;
  name: string;
  slug: string;
  problemCount: number;
}

interface NavbarSearchProps {
  companies: NavbarCompanyItem[];
  currentCompanySlug?: string;
}

export function NavbarSearch({ companies, currentCompanySlug }: NavbarSearchProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { targets } = useTargetCompanies();

  // Keyboard shortcut Ctrl/Cmd + K
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (slug: string) => {
    setOpen(false);
    router.push(`/dashboard?company=${slug}`);
  };

  // Split into pinned targets and other companies
  const { targetCompanies, otherCompanies } = React.useMemo(() => {
    const targetSet = new Set(targets.map((t) => t.toLowerCase()));
    const targetList: NavbarCompanyItem[] = [];
    const otherList: NavbarCompanyItem[] = [];

    companies.forEach((company) => {
      if (targetSet.has(company.slug.toLowerCase())) {
        targetList.push(company);
      } else {
        otherList.push(company);
      }
    });

    return { targetCompanies: targetList, otherCompanies: otherList };
  }, [companies, targets]);

  return (
    <>
      {/* Search trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search companies"
        className="flex items-center gap-2 rounded-md border border-border/80 bg-muted/40 hover:bg-muted/70 text-muted-foreground text-xs transition-all cursor-pointer p-2 sm:px-3 sm:py-1.5 sm:w-[220px] md:w-[260px] active:scale-95"
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <span className="hidden sm:inline truncate">Search companies...</span>
        <kbd className="hidden sm:inline-flex ml-auto text-[10px] text-muted-foreground/70 font-mono bg-background border border-border px-1.5 py-0.5 rounded shadow-2xs pointer-events-none">
          ⌘K
        </kbd>
      </button>

      {/* Command Palette Modal */}
      <CommandDialog open={open} onOpenChange={setOpen} title="Search Companies">
        <CommandInput placeholder="Search companies by name or tag..." />
        <CommandList className="max-h-[300px] sm:max-h-[360px] p-2">
          <CommandEmpty>
            <div className="py-6 text-center text-xs text-muted-foreground">
              <Building2 className="size-8 mx-auto mb-2 text-muted-foreground/40" />
              No companies found.
            </div>
          </CommandEmpty>

          {/* Pinned Target Companies */}
          {targetCompanies.length > 0 && (
            <>
              <CommandGroup heading="Target Companies">
                {targetCompanies.map((c) => {
                  const isCurrent = c.slug === currentCompanySlug;
                  return (
                    <CommandItem
                      key={`target-${c.id}`}
                      value={`${c.name} ${c.slug}`}
                      onSelect={() => handleSelect(c.slug)}
                      className={`flex items-center justify-between py-2.5 px-3 rounded-lg ${
                        isCurrent ? "bg-accent/70 font-medium" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CompanyLogo name={c.name} className="size-5.5 rounded-md text-[10px] shrink-0" />
                        <span className="truncate font-medium">{c.name}</span>
                        <Star className="size-3.5 text-amber-500 fill-amber-400 shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-mono">
                          {c.problemCount} Qs
                        </span>
                        <CornerDownLeft className="size-3 text-muted-foreground hidden sm:inline" />
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* All / Other Companies */}
          <CommandGroup heading={targetCompanies.length > 0 ? "All Companies" : "Companies"}>
            {otherCompanies.map((c) => {
              const isCurrent = c.slug === currentCompanySlug;
              return (
                <CommandItem
                  key={`company-${c.id}`}
                  value={`${c.name} ${c.slug}`}
                  onSelect={() => handleSelect(c.slug)}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg ${
                    isCurrent ? "bg-accent/70 font-medium" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CompanyLogo name={c.name} className="size-5.5 rounded-md text-[10px] shrink-0" />
                    <span className="truncate font-medium">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-mono">
                      {c.problemCount} Qs
                    </span>
                    <CornerDownLeft className="size-3 text-muted-foreground hidden sm:inline" />
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
