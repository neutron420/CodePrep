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
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { targets } = useTargetCompanies();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl/Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
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
    setQuery("");
    inputRef.current?.blur();
    router.push(`/dashboard?company=${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown") {
        setIsOpen(true);
      }
      return;
    }

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
    <div
      ref={containerRef}
      className="relative w-full max-w-[150px] xs:max-w-[190px] sm:max-w-[240px] md:max-w-[280px]"
    >
      {/* Search Input - Clean and natural on mobile and desktop */}
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className="w-full pl-8 pr-7 py-1.5 rounded-lg border bg-muted/40 hover:bg-muted/70 focus:bg-background text-xs transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-sm"
          >
            <X className="size-3" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex absolute right-2 text-[10px] text-muted-foreground/70 font-mono bg-background border px-1 rounded shadow-2xs pointer-events-none">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Dropdown - Right aligned so it stays 100% inside mobile and desktop viewports */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-[min(290px,calc(100vw-24px))] sm:w-80 rounded-xl border bg-popover text-popover-foreground shadow-xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="p-1.5 max-h-72 overflow-y-auto">
            <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {query ? `Matching (${filtered.length})` : "Target & Top Companies"}
            </div>

            {filtered.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                <Building2 className="size-6 mx-auto mb-1 text-muted-foreground/50" />
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
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left ${
                        isSelected
                          ? "bg-accent text-accent-foreground font-medium"
                          : "hover:bg-muted/50 text-foreground"
                      } ${isCurrent ? "border-l-2 border-primary pl-2" : ""}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
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
      )}
    </div>
  );
}
