import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function Topics() {
  const [topics, companyCount, problemCount] = await Promise.all([
    prisma.topic.findMany({
      select: { id: true, name: true, _count: { select: { problems: true } } },
      orderBy: { problems: { _count: "desc" } },
      take: 12,
    }),
    prisma.company.count(),
    prisma.problem.count(),
  ]);

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
