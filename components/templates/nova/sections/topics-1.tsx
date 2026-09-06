import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";

const FALLBACK_TOPICS = [
  { id: 1, name: "Array", _count: { problems: 850 } },
  { id: 2, name: "String", _count: { problems: 620 } },
  { id: 3, name: "Hash Table", _count: { problems: 490 } },
  { id: 4, name: "Dynamic Programming", _count: { problems: 450 } },
  { id: 5, name: "Tree", _count: { problems: 380 } },
  { id: 6, name: "Depth-First Search", _count: { problems: 350 } },
  { id: 7, name: "Sorting", _count: { problems: 310 } },
  { id: 8, name: "Binary Search", _count: { problems: 290 } },
  { id: 9, name: "Greedy", _count: { problems: 280 } },
  { id: 10, name: "Two Pointers", _count: { problems: 260 } },
  { id: 11, name: "Breadth-First Search", _count: { problems: 240 } },
  { id: 12, name: "Backtracking", _count: { problems: 210 } },
];

export default async function Topics() {
  let topics: { id: number; name: string; _count: { problems: number } }[] = FALLBACK_TOPICS;
  let companyCount = 694;
  let problemCount = 3277;

  try {
    const topicsResult = await withDbRetry(() =>
      prisma.topic.findMany({
        select: { id: true, name: true, _count: { select: { problems: true } } },
        orderBy: { problems: { _count: "desc" } },
        take: 12,
      })
    );
    if (topicsResult && topicsResult.length > 0) {
      topics = topicsResult;
    }

    const cCount = await withDbRetry(() => prisma.company.count());
    if (cCount) companyCount = cCount;

    const pCount = await withDbRetry(() => prisma.problem.count());
    if (pCount) problemCount = pCount;
  } catch (error) {
    console.warn("Using fallback topics in landing page:", error);
  }

  return (
    <section id="topics" className="bg-background @container py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div>
          <h2 className="text-balance font-serif text-4xl font-medium">
            Know what each question tests
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl text-balance">
            Every one of the {problemCount.toLocaleString()} problems across{" "}
            {companyCount.toLocaleString()} companies is tagged by topic, so you
            can drill into a single pattern at a time.
          </p>
        </div>
        <div className="@sm:grid-cols-3 @xl:grid-cols-4 mt-12 grid grid-cols-2 gap-3">
          {topics.map((topic) => (
            <Card
              key={topic.id}
              className="flex flex-col gap-1 p-4 transition-colors hover:border-foreground/20"
            >
              <span className="text-foreground text-sm font-medium capitalize">
                {topic.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {topic._count.problems.toLocaleString()} problems
              </span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
