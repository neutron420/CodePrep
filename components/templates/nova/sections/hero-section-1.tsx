"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { FlowButton } from "@/components/ui/flow-button";
import { HeroHeader } from "./header";
import Image from "next/image";
import { LeetCode } from "../svgs/leetcode";
import { Codeforces } from "../svgs/codeforces";
import { CodeChef } from "../svgs/codechef";
import { HackerRank } from "../svgs/hackerrank";
import { AtCoder } from "../svgs/atcoder";
import { CSES } from "../svgs/cses";
import { GeeksForGeeks } from "../svgs/geeksforgeeks";
import { TopCoder } from "../svgs/topcoder";

export default function HeroSection() {
  const router = useRouter();
  const { user } = useAuth();

  const handleStartPracticing = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <section className="bg-background relative">
          {/* Subtle Ambient Top Background Image & Gradient */}
          <div className="mask-radial-from-45% mask-radial-to-75% mask-radial-at-top mask-radial-[75%_100%] mask-t-from-50% lg:aspect-9/4 absolute inset-0 aspect-square lg:top-20 dark:opacity-25 dark:invert pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1740516367177-ae20098c8786?q=80&w=2268&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              width={2268}
              height={1740}
              priority
              unoptimized
              className="size-full object-cover object-top"
            />
          </div>

          {/* Hero Content Container */}
          <div className="relative z-10 pt-28 pb-16 sm:pt-36 sm:pb-20 md:pt-40 md:pb-24">
            {/* 1. Centered Header: Title, Description & CTA */}
            <div className="mx-auto max-w-3xl px-6 text-center">
              <h1 className="text-balance font-serif text-4xl font-medium sm:text-5xl md:text-6xl tracking-tight leading-[1.1]">
                Crack interviews,
                <br className="hidden sm:inline" /> company by company.
              </h1>
              <p className="text-muted-foreground mt-4 sm:mt-5 text-balance text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                15,000+ interview questions &amp; 3,200+ DSA problems across 690+ companies, tagged by topic.
                Tick off what you solve.
              </p>

              <div className="mt-7 sm:mt-8 flex justify-center">
                <FlowButton
                  text="Start Practicing"
                  onClick={handleStartPracticing}
                  variant="black"
                  className="h-12 px-9 text-sm font-semibold shadow-md"
                />
              </div>

              {/* 2. Platform Pills Row (All platforms visible, clean & modern) */}
              <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <LeetCode className="size-3.5 shrink-0" />
                  <span>LeetCode</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <Codeforces className="size-3.5 shrink-0" />
                  <span>Codeforces</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <CodeChef className="size-3.5 shrink-0" />
                  <span>CodeChef</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <HackerRank className="size-3.5 shrink-0" />
                  <span>HackerRank</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <GeeksForGeeks className="size-3.5 shrink-0" />
                  <span>GeeksForGeeks</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <AtCoder className="size-3.5 shrink-0" />
                  <span>AtCoder</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <CSES className="size-3.5 shrink-0" />
                  <span>CSES</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <TopCoder className="size-3.5 shrink-0" />
                  <span>TopCoder</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <svg viewBox="0 0 24 24" fill="none" className="size-3.5 shrink-0 rounded-xs" aria-label="CodeStudio">
                    <rect width="24" height="24" rx="5" fill="#F05A28" />
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>CodeStudio</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <svg viewBox="0 0 24 24" fill="none" className="size-3.5 shrink-0 rounded-xs" aria-label="HackerEarth">
                    <rect width="24" height="24" rx="5" fill="#2C3454" />
                    <path d="M7 6v12M17 6v12M7 12h10" stroke="#32C5FF" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <span>HackerEarth</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <svg viewBox="0 0 24 24" fill="none" className="size-3.5 shrink-0 rounded-xs" aria-label="InterviewBit">
                    <rect width="24" height="24" rx="5" fill="#009688" />
                    <path d="M8 7v10M13 7h3a2.5 2.5 0 0 1 0 5H13v5h3a2.5 2.5 0 0 0 0-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>InterviewBit</span>
                </div>
              </div>
            </div>

            {/* 3. LARGE PRODUCT SHOWCASE WITH TECHNICAL DASHED FRAME & CORNER CROSSES */}
            <div className="mt-10 sm:mt-12 md:mt-14 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
              {/* Soft Ambient Radial Glow behind the showcase */}
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -top-16 sm:-top-24 left-1/2 -translate-x-1/2 w-[70%] h-[240px] sm:h-[340px] bg-gradient-to-b from-primary/8 via-primary/3 to-transparent blur-3xl pointer-events-none -z-10 rounded-full"
                />

                {/* Outer Technical Frame: clearly visible black dashed border with 4 corner '+' cross markers */}
                <div className="relative p-3 sm:p-5 md:p-6 lg:p-7 rounded-lg sm:rounded-xl border-[1.5px] border-dashed border-zinc-900 dark:border-zinc-200 bg-zinc-900/[0.02] dark:bg-white/[0.02]">
                  {/* Corner "+" cross markers perfectly placed at the 4 dashed corner intersections */}
                  <span
                    aria-hidden="true"
                    className="absolute -top-3 -left-3 size-6 flex items-center justify-center font-mono text-base font-bold leading-none text-zinc-950 dark:text-zinc-50 bg-background select-none pointer-events-none"
                  >
                    +
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute -top-3 -right-3 size-6 flex items-center justify-center font-mono text-base font-bold leading-none text-zinc-950 dark:text-zinc-50 bg-background select-none pointer-events-none"
                  >
                    +
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-3 -left-3 size-6 flex items-center justify-center font-mono text-base font-bold leading-none text-zinc-950 dark:text-zinc-50 bg-background select-none pointer-events-none"
                  >
                    +
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-3 -right-3 size-6 flex items-center justify-center font-mono text-base font-bold leading-none text-zinc-950 dark:text-zinc-50 bg-background select-none pointer-events-none"
                  >
                    +
                  </span>

                  {/* Inner Product Screenshot Container */}
                  <div className="relative rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 flex items-center justify-center">
                    <Image
                      src="/banner1.png"
                      alt="CodeCraft Company-wise Interview Platform Preview"
                      width={1448}
                      height={934}
                      priority
                      quality={95}
                      className="w-full h-auto block select-none"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1200px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
