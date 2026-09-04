import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeroHeader } from "./header";
import { ChevronRight } from "lucide-react";
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
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <section className="bg-background">
          <div className="relative py-32 md:pt-44">
            <div className="mask-radial-from-45% mask-radial-to-75% mask-radial-at-top mask-radial-[75%_100%] mask-t-from-50% lg:aspect-9/4 absolute inset-0 aspect-square lg:top-24 dark:opacity-30 dark:invert">
              <Image
                src="https://images.unsplash.com/photo-1740516367177-ae20098c8786?q=80&w=2268&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="hero background"
                width={2268}
                height={1740}
                priority
                unoptimized
                className="size-full object-cover object-top"
              />
            </div>
            <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
              <div className="mx-auto max-w-md text-center">
                <h1 className="text-balance font-serif text-4xl font-medium sm:text-5xl">
                  Crack interviews, company by company.
                </h1>
                <p className="text-muted-foreground mt-4 text-balance">
                  3,257 LeetCode problems across 470 companies, tagged by topic.
                  Tick off what you solve.
                </p>

                <Button className="mt-6 pr-1.5 cursor-pointer" render={<Link href="/dashboard" />} nativeButton={false}>
                  <span className="text-nowrap">Start Practicing</span>
                  <ChevronRight className="opacity-50" />
                </Button>
              </div>
              <div className="mx-auto mt-24 max-w-xl">
                <div className="grid scale-95 grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 md:gap-12">
                  <div className="ml-auto blur-[2px]">
                    <Card className="shadow-foreground/10 flex h-8 w-fit flex-row items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <Codeforces className="size-4 shrink-0" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        Codeforces
                      </span>
                    </Card>
                  </div>
                  <div className="ml-auto">
                    <Card className="shadow-foreground/10 flex h-8 w-fit flex-row items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <LeetCode className="size-4 shrink-0" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        LeetCode
                      </span>
                    </Card>
                  </div>
                  <div className="ml-auto blur-[2px]">
                    <Card className="shadow-foreground/10 flex h-8 w-fit flex-row items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <CodeChef className="size-4 shrink-0" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        CodeChef
                      </span>
                    </Card>
                  </div>
                  <div className="mr-auto">
                    <Card className="shadow-foreground/10 flex h-8 w-fit flex-row items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <HackerRank className="size-4 shrink-0" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        HackerRank
                      </span>
                    </Card>
                  </div>
                  <div className="blur-[2px]">
                    <Card className="shadow-foreground/10 flex h-8 w-fit flex-row items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <AtCoder className="size-3 sm:size-4 shrink-0" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        AtCoder
                      </span>
                    </Card>
                  </div>
                  <div>
                    <Card className="shadow-foreground/10 flex h-8 w-fit flex-row items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <CSES className="size-3 sm:size-4 shrink-0" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        CSES
                      </span>
                    </Card>
                  </div>
                  <div className="ml-auto blur-[2px]">
                    <Card className="shadow-foreground/10 flex h-8 w-fit flex-row items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <TopCoder className="size-3 sm:size-4 shrink-0" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        TopCoder
                      </span>
                    </Card>
                  </div>
                  <div className="blur-[2px] ml-auto">
                    <Card className="shadow-foreground/10 flex h-8 w-fit flex-row items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <GeeksForGeeks className="size-3 sm:size-4 shrink-0" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        GeeksForGeeks
                      </span>
                    </Card>
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
