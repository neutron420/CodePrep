"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { Briefcase, CheckCheck, Database, Server, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    description:
      "Free forever for all developers practicing for technical coding interviews.",
    price: 0,
    yearlyPrice: 0,
    buttonText: "Start Practicing Free",
    buttonVariant: "outline" as const,
    badge: "Free Forever",
    badgeVariant: "emerald" as const,
    features: [
      { text: "690+ Company Question Banks", icon: <Briefcase size={20} /> },
      { text: "15,000+ Interview Questions", icon: <Database size={20} /> },
      { text: "Live Solved Progress Sync", icon: <Server size={20} /> },
    ],
    includes: [
      "Free includes:",
      "All 690+ company interview sheets",
      "74 curated DSA topic tags & filters",
      "Real-time instant search across problems",
      "Direct links to LeetCode, Codeforces & CodeChef",
      "Target company pinning to header",
      "Personal bookmarks vault in sidebar",
    ],
  },
  {
    name: "Pro Interview",
    description:
      "Advanced AI mock interviews, company hiring analytics, and revision streaks.",
    price: 12,
    yearlyPrice: 99,
    buttonText: "Get Pro Access",
    buttonVariant: "default" as const,
    badge: "Most Popular",
    badgeVariant: "orange" as const,
    popular: true,
    features: [
      { text: "AI Technical Mock Interviews", icon: <Briefcase size={20} /> },
      { text: "Hiring Trends & Frequency Analytics", icon: <Database size={20} /> },
      { text: "Spaced Repetition Flashcards", icon: <Server size={20} /> },
    ],
    includes: [
      "Everything in Starter, plus:",
      "AI simulated technical coding rounds",
      "Company hiring predictions & recency tags",
      "Weak-topic diagnostic analysis",
      "Optimal time & space complexity breakdowns",
      "Golden verified pro badge on profile",
      "Priority roadmap feature requests",
    ],
  },
  {
    name: "Campus & Teams",
    description:
      "Placement drive preparation tracks for colleges, bootcamps, and coding clubs.",
    price: 39,
    yearlyPrice: 329,
    buttonText: "Get Team Access",
    buttonVariant: "outline" as const,
    badge: "For Teams",
    badgeVariant: "zinc" as const,
    features: [
      { text: "Cohort & Batch Leaderboards", icon: <Briefcase size={20} /> },
      { text: "Custom Question Contests", icon: <Database size={20} /> },
      { text: "Dedicated Mentor Support", icon: <Server size={20} /> },
    ],
    includes: [
      "Everything in Pro, plus:",
      "Batch progress tracking & leaderboards",
      "College placement drive tracks",
      "Custom company contest creator",
      "Export student performance CSV",
      "Dedicated discord mentor channel",
      "Custom role permissions & workspaces",
    ],
  },
];

const PricingSwitch = ({
  onSwitch,
  className,
}: {
  onSwitch: (value: string) => void;
  className?: string;
}) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className={cn("flex justify-center sm:justify-start", className)}>
      <div className="relative z-10 flex w-fit rounded-xl bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 p-1">
        <button
          type="button"
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit cursor-pointer h-10 sm:h-11 rounded-lg sm:px-5 px-3 py-1 font-medium transition-colors text-xs sm:text-sm",
            selected === "0"
              ? "text-white font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute inset-0 rounded-lg shadow-sm bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly Billing</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit cursor-pointer h-10 sm:h-11 rounded-lg sm:px-5 px-3 py-1 font-medium transition-colors text-xs sm:text-sm",
            selected === "1"
              ? "text-white font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute inset-0 rounded-lg shadow-sm bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-1.5">
            Yearly Billing
            <span className="rounded-full bg-orange-100 dark:bg-orange-950/80 px-1.5 py-0.5 text-[10px] font-bold text-orange-700 dark:text-orange-300">
              Save 25%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection5() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.4,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -15,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <section id="pricing" className="bg-background py-16 sm:py-24 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative" ref={pricingRef}>
        
        {/* Header Section */}
        <article className="text-left mb-8 sm:mb-12 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="size-3.5" />
            <span>Pricing Plans</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.15]">
            We&apos;ve got a plan that&apos;s perfect for you
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Practice company-wise interview questions free forever. Upgrade anytime for advanced AI mocks and team analytics.
          </p>

          <div className="pt-2">
            <PricingSwitch onSwitch={togglePricingPeriod} className="w-fit" />
          </div>
        </article>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan, index) => (
            <TimelineContent
              key={plan.name}
              as="div"
              animationNum={2 + index}
              timelineRef={pricingRef}
              customVariants={revealVariants}
            >
              <Card
                className={`relative border flex flex-col justify-between h-full rounded-2xl transition-all duration-300 ${
                  plan.popular
                    ? "ring-2 ring-orange-500 bg-orange-50/40 dark:bg-orange-950/20 border-orange-300 dark:border-orange-800 shadow-xl shadow-orange-500/10"
                    : "bg-card border-border shadow-sm hover:shadow-md"
                }`}
              >
                <CardHeader className="text-left p-6 sm:p-7 pb-4">
                  <div className="flex justify-between items-center mb-2 gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      {plan.name}
                    </h3>
                    {plan.popular ? (
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                        {plan.badge}
                      </span>
                    ) : (
                      <span className="bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full text-xs font-medium border border-border">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 min-h-[38px] leading-relaxed">
                    {plan.description}
                  </p>
                  
                  {/* Clearly Visible Price Tag with NumberFlow Animation */}
                  <div className="flex items-baseline gap-1 py-1">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
                      $
                      <NumberFlow
                        format={{
                          currency: "USD",
                        }}
                        value={isYearly ? plan.yearlyPrice : plan.price}
                        className="text-3xl sm:text-4xl md:text-5xl font-black"
                      />
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm font-medium">
                      {plan.price === 0
                        ? "/forever"
                        : isYearly
                          ? "/year"
                          : "/month"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-6 sm:p-7 pt-0 flex flex-col justify-between flex-grow">
                  {/* Action CTA Button */}
                  <Link href="/dashboard" className="block w-full mb-6">
                    <button
                      type="button"
                      className={`w-full p-3 sm:p-3.5 text-sm sm:text-base font-semibold rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm ${
                        plan.popular
                          ? "bg-gradient-to-tr from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-orange-500/25 border border-orange-400"
                          : "bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 border border-transparent"
                      }`}
                    >
                      {plan.buttonText}
                    </button>
                  </Link>

                  {/* Feature benefits list */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                      Included Features
                    </h4>
                    <p className="font-semibold text-xs sm:text-sm text-foreground mb-2.5">
                      {plan.includes[0]}
                    </p>
                    <ul className="space-y-2.5 font-medium">
                      {plan.includes.slice(1).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2.5">
                          <span className="size-4.5 sm:size-5 bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/40 rounded-full grid place-content-center shrink-0 mt-0.5">
                            <CheckCheck className="size-3 sm:size-3.5 text-orange-500" />
                          </span>
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TimelineContent>
          ))}
        </div>

      </div>
    </section>
  );
}
