import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    description: "Everything, for everyone. No account needed.",
    price: "$0",
    period: "/forever",
    features: [
      "All 470 company lists",
      "All 3,257 problems",
      "Topic and difficulty filters",
      "Direct links to LeetCode",
    ],
    cta: "Browse Companies",
    highlighted: true,
  },
  {
    name: "Pro",
    description: "Deeper insights while you prep. Coming soon.",
    price: "Soon",
    period: "",
    features: [
      "Everything in Free",
      "Spaced-repetition revision",
      "Streaks and weak-topic reports",
      "Multi-platform problem sync",
    ],
    cta: "Coming Soon",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-background @container py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="">
          <h2 className="text-balance font-serif text-4xl font-medium">
            Free while you prep
          </h2>
          <p className="text-muted-foreground  mt-4 max-w-xl text-balance">
            Every company list and every problem is free. No credit card, no
            sign-up.
          </p>
        </div>
        <div className="grid-cols-2 mt-12 grid gap-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col p-6 ",
                plan.highlighted && "ring-primary",
              )}
            >
              <div>
                <h3 className="text-foreground font-medium">{plan.name}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {plan.description}
                </p>
              </div>
              <div className="mt-6">
                <span className="font-serif text-4xl font-medium">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-muted-foreground flex items-start gap-2 text-sm"
                  >
                    <Check className="text-primary mt-0.5 size-4 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.highlighted ? (
                <Button
                  className="mt-8 w-full"
                  render={<Link href="#features" />}
                  nativeButton={false}
                >
                  {plan.cta}
                </Button>
              ) : (
                <Button variant="outline" className="mt-8 w-full" disabled>
                  {plan.cta}
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
