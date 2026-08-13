import "dotenv/config";

import { prisma, disconnect } from "./lib/prisma";

interface Verdict {
  label: string;
  ok: boolean;
  detail: string;
}

function report(title: string, verdicts: Verdict[]): void {
  console.log("");
  console.log(`Verification: ${title}`);
  console.log("=".repeat(title.length + 14));
  let allOk = true;
  for (const verdict of verdicts) {
    console.log(`  [${verdict.ok ? "PASS" : "FAIL"}] ${verdict.label}: ${verdict.detail}`);
    if (!verdict.ok) {
      allOk = false;
    }
  }
  console.log("");
  console.log(allOk ? "All checks passed." : "Some checks FAILED.");
  if (!allOk) {
    process.exitCode = 1;
  }
}

async function main(): Promise<void> {
  const [
    companyCount,
    problemCount,
    relationshipCount,
    duplicateProblems,
    duplicateRelationships,
    multiCompanyExamples,
  ] = await Promise.all([
    prisma.company.count(),
    prisma.problem.count(),
    prisma.companyProblem.count(),
    prisma.problem.groupBy({ by: ["slug"], having: { slug: { _count: { gt: 1 } } } }),
    prisma.companyProblem.groupBy({
      by: ["companyId", "problemId"],
      having: { companyId: { _count: { gt: 1 } } },
    }),
    prisma.problem.findMany({
      where: { companies: { some: {} } },
      orderBy: { companies: { _count: "desc" } },
      take: 5,
      select: {
        title: true,
        slug: true,
        difficulty: true,
        _count: { select: { companies: true } },
      },
    }),
  ]);

  report("Database state", [
    { label: "Companies", ok: companyCount > 0, detail: `${companyCount} companies` },
    { label: "Problems", ok: problemCount > 0, detail: `${problemCount} problems` },
    { label: "CompanyProblem relationships", ok: relationshipCount > 0, detail: `${relationshipCount} relationships` },
  ]);

  report("No duplicates", [
    { label: "Duplicate problems", ok: duplicateProblems.length === 0, detail: `${duplicateProblems.length} duplicates found` },
    {
      label: "Duplicate relationships",
      ok: duplicateRelationships.length === 0,
      detail: `${duplicateRelationships.length} duplicates found`,
    },
  ]);

  report("Multi-company problems (sample: most shared first)", [
    ...multiCompanyExamples.map(
      (example) =>
        ({
          label: example.title,
          ok: true,
          detail: `${example.slug} (${example.difficulty}) belongs to ${example._count.companies} companies`,
        }) as Verdict,
    ),
  ]);

  await disconnect();
}

main();
