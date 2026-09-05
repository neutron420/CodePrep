"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronRight,
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
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/context/auth-context";
import { COMPANY_CATEGORIES, CompanyCategoryDef } from "@/lib/company-categories";
import { CompanyLogo } from "@/components/company-logo";
import { KodePrepLogo } from "@/components/kodeprep-logo";

function CategoryIcon({ name }: { name: CompanyCategoryDef["iconName"] | string }) {
  switch (name) {
    case "Flame":
      return <Flame className="size-4 text-rose-500" />;
    case "Sparkles":
      return <Sparkles className="size-4 text-fuchsia-500" />;
    case "TrendingUp":
      return <TrendingUp className="size-4 text-amber-500" />;
    case "Landmark":
      return <Landmark className="size-4 text-emerald-500" />;
    case "Crown":
      return <Crown className="size-4 text-purple-500" />;
    case "Cloud":
      return <Cloud className="size-4 text-sky-500" />;
    case "ShieldCheck":
      return <ShieldCheck className="size-4 text-teal-500" />;
    case "Cpu":
      return <Cpu className="size-4 text-indigo-500" />;
    case "ShoppingBag":
      return <ShoppingBag className="size-4 text-pink-500" />;
    case "Car":
      return <Car className="size-4 text-blue-600" />;
    case "UtensilsCrossed":
      return <UtensilsCrossed className="size-4 text-orange-500" />;
    case "MessageSquare":
      return <MessageSquare className="size-4 text-cyan-500" />;
    case "Gamepad2":
      return <Gamepad2 className="size-4 text-violet-500" />;
    case "Activity":
      return <Activity className="size-4 text-rose-600" />;
    case "Briefcase":
      return <Briefcase className="size-4 text-blue-500" />;
    case "GraduationCap":
      return <GraduationCap className="size-4 text-yellow-500" />;
    case "Compass":
      return <Compass className="size-4 text-emerald-600" />;
    case "Radio":
      return <Radio className="size-4 text-violet-600" />;
    case "Zap":
      return <Zap className="size-4 text-amber-600" />;
    default:
      return <Building2 className="size-4 text-cyan-500" />;
  }
}

function SidebarCloseButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      onClick={toggleSidebar}
      className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
      title="Close sidebar"
    >
      <X className="size-4" />
    </button>
  );
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

export function KodePrepSidebar({ companies, selectedCompanySlug }: KodePrepSidebarProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
    });

    const otherItems = companies.filter((c) => !categorizedIds.has(c.id));

    return {
      categories,
      otherItems,
    };
  }, [companies]);

  const selectCompany = (slug: string) => {
    router.push(`/dashboard?company=${slug}`);
  };

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-border bg-sidebar">
      {/* Header / Brand Logo + Close Button - Exactly matches Navbar height h-14 & 18px horizontal alignment */}
      <SidebarHeader className="h-14 flex-row items-center justify-between p-0 px-[18px] border-b border-border shrink-0">
        <KodePrepLogo />

        {/* Close (X) Button */}
        <SidebarCloseButton />
      </SidebarHeader>

      {/* Content / Categories */}
      <SidebarContent className="px-2 py-3 space-y-2">
        {/* Categorized Groups */}
        {categorizedCompanies.categories.map((category) => {
          if (category.items.length === 0) return null;
          const isOpen = openCategories[category.id] ?? false;

          return (
            <Collapsible key={category.id} open={isOpen} onOpenChange={() => toggleCategory(category.id)} className="group/collapsible">
              <SidebarGroup className="p-0">
                <SidebarGroupLabel>
                  <CollapsibleTrigger className="flex w-full items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-lg hover:bg-sidebar-accent/50">
                    <span className="flex items-center gap-2">
                      <CategoryIcon name={category.iconName} />
                      <span className="font-sans font-semibold">{category.name}</span>
                    </span>
                    <ChevronRight className="size-3.5 transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent className="transition-all duration-300 ease-in-out overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <SidebarGroupContent className="pt-1 pl-1">
                    <SidebarMenu>
                      {category.items.map((company) => {
                        const isActive = selectedCompanySlug === company.slug;
                        return (
                          <SidebarMenuItem key={company.id}>
                            <SidebarMenuButton
                              onClick={() => selectCompany(company.slug)}
                              isActive={isActive}
                              className={`w-full justify-between px-2 py-1.5 text-xs rounded-lg transition-all duration-200 cursor-pointer ${
                                isActive
                                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                  : "hover:bg-sidebar-accent text-sidebar-foreground"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <CompanyLogo name={company.name} className="size-5 text-[10px] rounded-md" />
                                <span className="truncate font-sans font-medium">{company.name}</span>
                              </div>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium ${
                                  isActive
                                    ? "bg-primary-foreground/20 text-primary-foreground"
                                    : "bg-sidebar-accent text-muted-foreground"
                                }`}
                              >
                                {company.problemCount}
                              </span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}

        {/* All Other Companies */}
        {categorizedCompanies.otherItems.length > 0 && (
          <Collapsible
            open={openCategories["__other"] ?? false}
            onOpenChange={() => toggleCategory("__other")}
            className="group/collapsible"
          >
            <SidebarGroup className="p-0">
              <SidebarGroupLabel>
                <CollapsibleTrigger className="flex w-full items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-lg hover:bg-sidebar-accent/50">
                  <span className="flex items-center gap-2">
                    <Building2 className="size-3.5 text-primary" />
                    <span className="font-sans font-semibold">All Other Companies ({categorizedCompanies.otherItems.length})</span>
                  </span>
                  <ChevronRight className="size-3.5 transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>

              <CollapsibleContent className="transition-all duration-300 ease-in-out overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <SidebarGroupContent className="pt-1 pl-1 max-h-72 overflow-y-auto pr-1">
                  <SidebarMenu>
                    {categorizedCompanies.otherItems.map((company) => {
                      const isActive = selectedCompanySlug === company.slug;
                      return (
                        <SidebarMenuItem key={company.id}>
                          <SidebarMenuButton
                            onClick={() => selectCompany(company.slug)}
                            isActive={isActive}
                            className={`w-full justify-between px-2 py-1.5 text-xs rounded-lg transition-all duration-200 cursor-pointer ${
                              isActive
                                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                : "hover:bg-sidebar-accent text-sidebar-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <CompanyLogo name={company.name} className="size-5 text-[10px] rounded-md" />
                              <span className="truncate font-sans font-medium">{company.name}</span>
                            </div>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium ${
                                isActive
                                  ? "bg-primary-foreground/20 text-primary-foreground"
                                  : "bg-sidebar-accent text-muted-foreground"
                              }`}
                            >
                              {company.problemCount}
                            </span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}
      </SidebarContent>

      {/* User Profile Footer Section matching screenshots */}
      <div className="p-2 border-t border-sidebar-border bg-sidebar shrink-0 relative">
        {user ? (
          <div className="relative">
            {/* Account Popover matching user's screenshot */}
            {isAccountOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-3.5 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                  <span className="font-bold text-sm text-white">Account</span>
                  <button
                    type="button"
                    onClick={() => setIsAccountOpen(false)}
                    className="text-zinc-400 hover:text-white cursor-pointer p-1 rounded-md hover:bg-zinc-800 transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={async () => {
                      setIsAccountOpen(false);
                      await signOut();
                      router.push("/login");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    <LogOut className="size-4 stroke-[2.2]" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* Profile Card Button matching Screenshot */}
            <button
              type="button"
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-850 dark:bg-zinc-900/80 dark:hover:bg-zinc-800/90 border border-zinc-800/80 transition-all cursor-pointer text-left group"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="size-9 rounded-lg object-cover shrink-0 border border-zinc-700/80 shadow-xs"
                />
              ) : (
                <div className="size-9 rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                  {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-sidebar-foreground truncate leading-tight">
                  {user.displayName || user.email?.split("@")[0] || user.phoneNumber || "User"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate font-mono mt-0.5 leading-tight">
                  {user.email || user.phoneNumber || "Logged in"}
                </p>
              </div>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs transition-all shadow-sm cursor-pointer"
          >
            <LogIn className="size-4" />
            <span>Login to CodeCraft</span>
          </Link>
        )}
      </div>
    </Sidebar>
  );
}
