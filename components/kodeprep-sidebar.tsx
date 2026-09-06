"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Flame,
  TrendingUp,
  Briefcase,
  Crown,
  X,
  Landmark,
  Cloud,
  Cpu,
  ShoppingBag,
  Gamepad2,
  Activity,
  Sparkles,
  ShieldCheck,
  Car,
  UtensilsCrossed,
  MessageSquare,
  GraduationCap,
  Compass,
  Radio,
  Zap,
  LogOut,
  LogIn,
  ArrowLeft,
  Search,
  Plus,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/context/auth-context";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { COMPANY_CATEGORIES, CompanyCategoryDef } from "@/lib/company-categories";
import { CompanyLogo } from "@/components/company-logo";
import { KodePrepLogo } from "@/components/kodeprep-logo";

function CategoryIcon({ name }: { name: CompanyCategoryDef["iconName"] | string }) {
  switch (name) {
    case "Flame":
      return <Flame className="size-4 text-rose-500 shrink-0" />;
    case "Sparkles":
      return <Sparkles className="size-4 text-fuchsia-500 shrink-0" />;
    case "TrendingUp":
      return <TrendingUp className="size-4 text-amber-500 shrink-0" />;
    case "Landmark":
      return <Landmark className="size-4 text-emerald-500 shrink-0" />;
    case "Crown":
      return <Crown className="size-4 text-purple-500 shrink-0" />;
    case "Cloud":
      return <Cloud className="size-4 text-sky-500 shrink-0" />;
    case "ShieldCheck":
      return <ShieldCheck className="size-4 text-teal-500 shrink-0" />;
    case "Cpu":
      return <Cpu className="size-4 text-indigo-500 shrink-0" />;
    case "ShoppingBag":
      return <ShoppingBag className="size-4 text-pink-500 shrink-0" />;
    case "Car":
      return <Car className="size-4 text-blue-600 shrink-0" />;
    case "UtensilsCrossed":
      return <UtensilsCrossed className="size-4 text-orange-500 shrink-0" />;
    case "MessageSquare":
      return <MessageSquare className="size-4 text-cyan-500 shrink-0" />;
    case "Gamepad2":
      return <Gamepad2 className="size-4 text-violet-500 shrink-0" />;
    case "Activity":
      return <Activity className="size-4 text-rose-600 shrink-0" />;
    case "Briefcase":
      return <Briefcase className="size-4 text-blue-500 shrink-0" />;
    case "GraduationCap":
      return <GraduationCap className="size-4 text-yellow-500 shrink-0" />;
    case "Compass":
      return <Compass className="size-4 text-emerald-600 shrink-0" />;
    case "Radio":
      return <Radio className="size-4 text-violet-600 shrink-0" />;
    case "Zap":
      return <Zap className="size-4 text-amber-600 shrink-0" />;
    default:
      return <Building2 className="size-4 text-cyan-500 shrink-0" />;
  }
}

export interface CompanySidebarItem {
  id: number;
  name: string;
  slug: string;
  problemCount: number;
}

interface KodePrepSidebarProps {
  companies: CompanySidebarItem[];
  selectedCompanySlug: string;
}

const PRIMARY_CATEGORY_LIMIT = 5;

export function KodePrepSidebar({ companies, selectedCompanySlug }: KodePrepSidebarProps) {
  const [drilldownCategory, setDrilldownCategory] = useState<
    | (CompanyCategoryDef & { items: CompanySidebarItem[] })
    | { id: string; name: string; iconName?: string; items: CompanySidebarItem[] }
    | null
  >(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const { count: bookmarkCount } = useBookmarks();
  const { isMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBookmarksActive = searchParams.get("status") === "BOOKMARKED";

  // Group companies into defined categories
  const categorizedCompanies = useMemo(() => {
    const companyMap = new Map<string, CompanySidebarItem>();
    companies.forEach((c) => companyMap.set(c.slug.toLowerCase(), c));

    const categorizedIds = new Set<number>();

    const categories = COMPANY_CATEGORIES.map((cat) => {
      const items: CompanySidebarItem[] = [];
      cat.slugs.forEach((slug) => {
        const company = companyMap.get(slug);
        if (company) {
          items.push(company);
          categorizedIds.add(company.id);
        }
      });
      return {
        ...cat,
        items,
      };
    }).filter((cat) => cat.items.length > 0);

    const otherItems = companies.filter((c) => !categorizedIds.has(c.id));

    return {
      categories,
      otherItems,
    };
  }, [companies]);

  // Find which category contains the selected company
  const activeCategoryId = useMemo(() => {
    for (const cat of categorizedCompanies.categories) {
      if (cat.items.some((c) => c.slug === selectedCompanySlug)) {
        return cat.id;
      }
    }
    if (categorizedCompanies.otherItems.some((c) => c.slug === selectedCompanySlug)) {
      return "__other";
    }
    return null;
  }, [categorizedCompanies, selectedCompanySlug]);

  const selectCompany = (slug: string) => {
    router.push(`/dashboard?company=${slug}`);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleClose = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      toggleSidebar();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    if (isMobile) {
      setOpenMobile(false);
    }
    router.push("/login");
  };

  // Filter drilldown items by internal search query
  const filteredDrilldownItems = useMemo(() => {
    if (!drilldownCategory) return [];
    if (!categorySearchQuery.trim()) return drilldownCategory.items;
    const q = categorySearchQuery.toLowerCase().trim();
    return drilldownCategory.items.filter((c) =>
      c.name.toLowerCase().includes(q)
    );
  }, [drilldownCategory, categorySearchQuery]);

  const primaryCategories = categorizedCompanies.categories.slice(0, PRIMARY_CATEGORY_LIMIT);
  const remainingCategories = categorizedCompanies.categories.slice(PRIMARY_CATEGORY_LIMIT);

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-border/40 bg-sidebar/95 backdrop-blur-md"
    >
      {/* ========================================================================= */}
      {/* 1. HEADER (BRANDING + CLOSE BUTTON)                                       */}
      {/* ========================================================================= */}
      <SidebarHeader className="h-14 flex-row items-center justify-between p-0 px-4 border-b border-border/40 shrink-0 bg-transparent">
        <KodePrepLogo />
        <button
          type="button"
          onClick={handleClose}
          className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          title="Close sidebar"
          aria-label="Close sidebar"
        >
          <X className="size-4" />
        </button>
      </SidebarHeader>

      {/* ========================================================================= */}
      {/* 2. SCROLLABLE NAVIGATION AREA                                             */}
      {/* ========================================================================= */}
      <SidebarContent className="flex-1 overflow-y-auto no-scrollbar p-2.5 space-y-2">
        {drilldownCategory ? (
          /* --------------------------------------------------------------------- */
          /* DRILL-DOWN VIEW (LEVEL 2: COMPANIES IN SELECTED CATEGORY)             */
          /* --------------------------------------------------------------------- */
          <div className="space-y-2 animate-in fade-in-50 duration-150">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setDrilldownCategory(null);
                setCategorySearchQuery("");
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>All Categories</span>
            </button>

            {/* Category Header Card */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-muted/40 border border-border/50">
              <div className="flex items-center gap-2 min-w-0">
                <CategoryIcon name={drilldownCategory.iconName || "Building2"} />
                <span className="text-xs font-bold text-foreground truncate">
                  {drilldownCategory.name}
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground shrink-0">
                {drilldownCategory.items.length}
              </span>
            </div>

            {/* Quick Search inside category if more than 6 companies */}
            {drilldownCategory.items.length > 6 && (
              <div className="relative pt-0.5">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  placeholder={`Filter ${drilldownCategory.name}...`}
                  className="w-full pl-7 pr-7 py-1.5 text-xs rounded-lg border border-border/70 bg-card/60 placeholder:text-muted-foreground/60 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {categorySearchQuery && (
                  <button
                    type="button"
                    onClick={() => setCategorySearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            )}

            {/* Companies List */}
            <div className="space-y-1 pt-1">
              {filteredDrilldownItems.map((company) => {
                const isActive = selectedCompanySlug === company.slug;
                return (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => selectCompany(company.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "hover:bg-muted/60 text-foreground/90"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CompanyLogo
                        name={company.name}
                        className="size-5 text-[10px] rounded-md border border-border/50 shrink-0"
                      />
                      <span className="truncate font-medium">{company.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium ${
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {company.problemCount}
                      </span>
                      {isActive && (
                        <span className="size-1.5 rounded-full bg-primary-foreground shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}

              {filteredDrilldownItems.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No matching companies
                </p>
              )}
            </div>
          </div>
        ) : (
          /* --------------------------------------------------------------------- */
          /* MAIN CATEGORIES VIEW (LEVEL 1)                                        */
          /* --------------------------------------------------------------------- */
          <div className="space-y-3">
            {/* Section Header */}
            <div className="flex items-center justify-between px-2 pt-1 pb-0.5">
              <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                Companies
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {companies.length} Total
              </span>
            </div>

            {/* Primary Top Categories */}
            <div className="space-y-0.5">
              {primaryCategories.map((category) => {
                const isCatActive = activeCategoryId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setDrilldownCategory(category);
                      setCategorySearchQuery("");
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer group ${
                      isCatActive
                        ? "bg-muted/80 text-foreground font-semibold border border-border/60 shadow-2xs"
                        : "hover:bg-muted/50 text-foreground/90"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CategoryIcon name={category.iconName} />
                      <span className="truncate font-medium">{category.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono text-muted-foreground bg-muted/60">
                        {category.items.length}
                      </span>
                      {isCatActive && (
                        <span className="w-1 h-3.5 rounded-full bg-primary shrink-0" />
                      )}
                      <ChevronRight className="size-3.5 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Progressive Disclosure: Remaining Categories */}
            {remainingCategories.length > 0 && (
              <div className="space-y-1 pt-0.5 border-t border-border/40">
                {showAllCategories ? (
                  <div className="space-y-0.5 pt-1 animate-in fade-in-50 duration-200">
                    {remainingCategories.map((category) => {
                      const isCatActive = activeCategoryId === category.id;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            setDrilldownCategory(category);
                            setCategorySearchQuery("");
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
                            isCatActive
                              ? "bg-muted/80 text-foreground font-semibold border border-border/60 shadow-2xs"
                              : "hover:bg-muted/50 text-foreground/90"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <CategoryIcon name={category.iconName} />
                            <span className="truncate font-medium">{category.name}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono text-muted-foreground bg-muted/60">
                              {category.items.length}
                            </span>
                            {isCatActive && (
                              <span className="w-1 h-3.5 rounded-full bg-primary shrink-0" />
                            )}
                            <ChevronRight className="size-3.5 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setShowAllCategories(false)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <span>Show Fewer Categories</span>
                      <ChevronDown className="size-3.5 rotate-180 transition-transform" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAllCategories(true)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="size-3.5 text-primary group-hover:rotate-90 transition-transform" />
                      <span>View More Categories</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/70 text-muted-foreground">
                      +{remainingCategories.length}
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Other Uncategorized Companies (if any) */}
            {categorizedCompanies.otherItems.length > 0 && (
              <div className="pt-1 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => {
                    setDrilldownCategory({
                      id: "__other",
                      name: "Other Companies",
                      iconName: "Building2",
                      items: categorizedCompanies.otherItems,
                    });
                    setCategorySearchQuery("");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer group ${
                    activeCategoryId === "__other"
                      ? "bg-muted/80 text-foreground font-semibold border border-border/60 shadow-2xs"
                      : "hover:bg-muted/50 text-foreground/90"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Building2 className="size-4 text-primary shrink-0" />
                    <span className="truncate font-medium">All Other Companies</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono text-muted-foreground bg-muted/60">
                      {categorizedCompanies.otherItems.length}
                    </span>
                    {activeCategoryId === "__other" && (
                      <span className="w-1 h-3.5 rounded-full bg-primary shrink-0" />
                    )}
                    <ChevronRight className="size-3.5 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
      </SidebarContent>

      {/* ========================================================================= */}
      {/* 3. DOWNSIDE NAVIGATION & ACCOUNT FOOTER                                   */}
      {/* ========================================================================= */}
      <div className="shrink-0 p-2.5 border-t border-border/40 bg-transparent space-y-2">
        {/* Bookmarks downside menu item (matching user reference image style) */}
        <button
          type="button"
          onClick={() => {
            if (isBookmarksActive) {
              router.push(`/dashboard${selectedCompanySlug ? `?company=${selectedCompanySlug}` : ""}`);
            } else {
              router.push(`/dashboard?status=BOOKMARKED${selectedCompanySlug ? `&company=${selectedCompanySlug}` : ""}`);
            }
            if (isMobile) setOpenMobile(false);
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
            isBookmarksActive
              ? "bg-muted text-foreground font-semibold border border-border/60 shadow-2xs"
              : "text-foreground/90 hover:bg-muted/60 hover:text-foreground"
          }`}
          title="Bookmarks"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Bookmark
              className={`size-4 shrink-0 transition-colors ${
                isBookmarksActive
                  ? "text-cyan-400 fill-cyan-400/20"
                  : "text-cyan-400 group-hover:text-cyan-300"
              }`}
            />
            <span className="truncate">Bookmarks</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {bookmarkCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono text-muted-foreground bg-muted/60">
                {bookmarkCount}
              </span>
            )}
            {isBookmarksActive && (
              <span className="w-1 h-3.5 rounded-full bg-cyan-400 shrink-0" />
            )}
          </div>
        </button>

        {user ? (
          <div className="rounded-xl border border-border/50 bg-muted/40 p-2 flex items-center justify-between gap-2 shadow-2xs">
            {/* User Details */}
            <div className="flex items-center gap-2.5 min-w-0">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="size-8 rounded-lg object-cover border border-border/60 shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="size-8 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0">
                  {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate leading-tight">
                    {user.displayName || user.email?.split("@")[0] || user.phoneNumber || "User"}
                  </p>
                  <VerifiedBadge className="size-3.5 shrink-0" />
                </div>
                <p className="text-[10.5px] text-muted-foreground truncate font-mono mt-0.5 leading-tight">
                  {user.email || user.phoneNumber || "Signed in"}
                </p>
              </div>
            </div>

            {/* Quick Sign Out Action */}
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign Out"
              aria-label="Sign Out"
              className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            onClick={() => isMobile && setOpenMobile(false)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-all shadow-xs cursor-pointer"
          >
            <LogIn className="size-3.5" />
            <span>Login to CodeCraft</span>
          </Link>
        )}
      </div>
    </Sidebar>
  );
}
