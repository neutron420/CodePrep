"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Building2, CornerDownLeft, Star } from "lucide-react";
import { CompanyLogo } from "@/components/company-logo";
import { useTargetCompanies } from "@/lib/hooks/use-target-companies";

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
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { targets } = useTargetCompanies();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to let animation start
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard shortcut Ctrl/Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered companies
  const filtered = useMemo(() => {
    if (!query.trim()) {
      const companyMap = new Map<string, NavbarCompanyItem>();
      companies.forEach((c) => companyMap.set(c.slug.toLowerCase(), c));

      // Pinned targets first, then top companies
      const pinned = targets
        .map((slug) => companyMap.get(slug.toLowerCase()))
        .filter((c): c is NavbarCompanyItem => Boolean(c));

      const remaining = companies
        .filter((c) => !targets.includes(c.slug.toLowerCase()))
        .slice(0, 10 - pinned.length);

      return [...pinned, ...remaining];
    }

    const q = query.toLowerCase().trim();
    return companies
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [companies, query, targets]);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    router.push(`/dashboard?company=${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex].slug);
      }
    }
  };

  return (
    <>
      {/* Trigger Button in Navbar — icon only on mobile, full bar on sm+ */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border bg-muted/40 hover:bg-muted/70 text-muted-foreground text-xs transition-all cursor-pointer p-1.5 sm:px-3 sm:py-1.5 sm:w-[240px] md:w-[280px]"
      >
        <Search className="size-4 sm:size-3.5 shrink-0" />
        <span className="hidden sm:inline truncate">Search...</span>
        <kbd className="hidden sm:inline-flex ml-auto text-[10px] text-muted-foreground/70 font-mono bg-background border px-1 rounded shadow-2xs pointer-events-none">
          ⌘K
        </kbd>
      </button>

      {/* Full-Screen Centered Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150" />

          {/* Search Modal */}
          <div className="relative w-[min(480px,calc(100vw-32px))] rounded-xl border bg-popover text-popover-foreground shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 slide-in-from-top-2 duration-200">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search companies..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="p-0.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-sm"
                >
                  <X className="size-4" />
                </button>
              ) : (
                <kbd className="text-[10px] text-muted-foreground/70 font-mono bg-muted border px-1.5 py-0.5 rounded shadow-2xs">
                  ESC
                </kbd>
              )}
            </div>

            {/* Results */}
            <div className="p-1.5 max-h-72 overflow-y-auto">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {query ? `Matching (${filtered.length})` : "Target & Top Companies"}
              </div>

              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  <Building2 className="size-7 mx-auto mb-2 text-muted-foreground/40" />
                  No companies found matching &ldquo;{query}&rdquo;
                </div>
              ) : (
                <div className="space-y-0.5">
                  {filtered.map((c, idx) => {
                    const isSelected = idx === selectedIndex;
                    const isCurrent = c.slug === currentCompanySlug;
                    const isPinned = targets.includes(c.slug.toLowerCase());

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => handleSelect(c.slug)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer text-left ${
                          isSelected
                            ? "bg-accent text-accent-foreground font-medium"
                            : "hover:bg-muted/50 text-foreground"
                        } ${isCurrent ? "border-l-2 border-primary pl-2.5" : ""}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CompanyLogo name={c.name} className="size-5 rounded-md text-[10px] shrink-0" />
                          <span className="truncate font-medium">{c.name}</span>
                          {isPinned && (
                            <Star className="size-3 text-amber-500 fill-amber-400 shrink-0" />
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground font-mono">
                            {c.problemCount} Qs
                          </span>
                          {isSelected && (
                            <CornerDownLeft className="size-3 text-muted-foreground hidden sm:inline" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
