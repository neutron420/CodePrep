import "dotenv/config";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseCsvFile } from "./lib/csv";
import { chunk, normalizeDifficulty, normalizeProblemUrl, slugifyCompanyName } from "./lib/normalize";
import { prisma, disconnect } from "./lib/prisma";
import type { Difficulty, Prisma } from "../app/generated/prisma/client";

const ALIASES: Record<string, string> = {
  "cruise-automation": "cruise",
  "jtg": "josh-technology",
  "kla-tencor": "kla",
  "larsen-toubro": "larsen-and-toubro",
  "lendingkart": "lendingkart-technologies",
  "lowe": "lowes",
  "national-payments-coorperation-india": "national-payments-corporation-of-india",
  "ola": "ola-cabs",
  "pure": "pure-storage",
  "ramp": "ramp-finance",
  "ramp-2": "ramp-finance",
  "reliance-retails": "reliance-retail",
  "snapchat": "snap",
  "square": "block",
  "tower-research": "tower-research-capital",
  "tripactions": "navan",
  "twitter": "x",
  "veeva": "veeva-systems",
  "virtu": "virtu-financial",
  "wissen": "wissen-technology",
};

interface SnehasishProblem {
  leetcodeId: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  url: string;
}

async function main(): Promise<void> {
  console.log("Starting import from data/snehasishroy...");

  // Clean up any test company if created
  await prisma.company.deleteMany({ where: { slug: "ramp-2" } });

  // 1. Fetch existing companies
  const dbCompanies = await prisma.company.findMany({ select: { id: true, name: true, slug: true } });
  const companyBySlug = new Map<string, { id: number; name: string; slug: string }>();
  const companyByClean = new Map<string, { id: number; name: string; slug: string }>();

  for (const c of dbCompanies) {
    companyBySlug.set(c.slug, c);
    companyByClean.set(c.slug.replace(/[^a-z0-9]/g, ""), c);
  }

  // 2. Fetch existing problems
  const dbProblems = await prisma.problem.findMany({
    select: { id: true, slug: true, title: true, difficulty: true, leetcodeId: true, leetcodeUrl: true },
  });
  const problemBySlug = new Map<string, { id: number; slug: string }>();
  for (const p of dbProblems) {
    problemBySlug.set(p.slug, { id: p.id, slug: p.slug });
  }

  console.log(`Initial DB State: ${dbCompanies.length} companies, ${dbProblems.length} problems`);

  // 3. Scan directories in data/snehasishroy
  const baseDir = "data/snehasishroy";
  const entries = readdirSync(baseDir).filter((entry) => {
    if (entry === ".git" || entry === "src" || entry === "Readme.md" || entry === "README.md") return false;
    return statSync(join(baseDir, entry)).isDirectory();
  });

  console.log(`Found ${entries.length} candidate company folders in ${baseDir}.`);

  const rawProblemsToUpsert = new Map<string, SnehasishProblem>();
  const companyProblemPairs: { companyId: number; problemSlug: string }[] = [];

  for (const dir of entries) {
    // Resolve company
    const targetSlug = ALIASES[dir] ?? slugifyCompanyName(dir);
    let matchedCompany = companyBySlug.get(targetSlug) ?? companyByClean.get(dir.toLowerCase().replace(/[^a-z0-9]/g, ""));

    if (!matchedCompany && ALIASES[dir]) {
      matchedCompany = companyBySlug.get(ALIASES[dir]);
    }

    if (!matchedCompany) {
      console.warn(`Unmatched company directory: ${dir}`);
      continue;
    }

    const dirPath = join(baseDir, dir);
    const files = readdirSync(dirPath).filter((f) => f.toLowerCase().endsWith(".csv"));

    for (const f of files) {
      const filePath = join(dirPath, f);
      const { records } = parseCsvFile(filePath);

      for (const { record } of records) {
        const rawUrl = record["URL"] || record["Link"] || record["url"] || record["link"];
        const normUrl = normalizeProblemUrl(rawUrl);
        if (!normUrl) continue;

        const rawDiff = record["Difficulty"] || record["difficulty"];
        const normDiff = normalizeDifficulty(rawDiff);
        if (!normDiff) continue;

        const title = (record["Title"] || record["title"] || "").trim();
        if (!title) continue;

        const rawId = (record["ID"] || record["Id"] || record["id"] || "").trim();
        const leetcodeId = rawId || normUrl.slug;

        if (!rawProblemsToUpsert.has(normUrl.slug)) {
          rawProblemsToUpsert.set(normUrl.slug, {
            leetcodeId,
            title,
            slug: normUrl.slug,
            difficulty: normDiff,
            url: normUrl.url,
          });
        }

        companyProblemPairs.push({
          companyId: matchedCompany.id,
          problemSlug: normUrl.slug,
        });
      }
    }
  }

  // 4. Identify and insert new problems in bulk
  const newProblems: Prisma.ProblemCreateManyInput[] = [];
  for (const [slug, prob] of rawProblemsToUpsert) {
    if (!problemBySlug.has(slug)) {
      newProblems.push({
        leetcodeId: prob.slug, // using slug as unique leetcodeId prevents ID collisions
        title: prob.title,
        slug: prob.slug,
        difficulty: prob.difficulty,
        leetcodeUrl: prob.url,
      });
    }
  }

  console.log(`New problems to insert: ${newProblems.length}`);

  if (newProblems.length > 0) {
    const result = await prisma.problem.createMany({
      data: newProblems,
      skipDuplicates: true,
    });
    console.log(`Successfully created ${result.count} new problems.`);

    // Fetch newly created problems to populate problemBySlug
    const inserted = await prisma.problem.findMany({
      where: { slug: { in: newProblems.map((p) => p.slug) } },
      select: { id: true, slug: true },
    });
    for (const p of inserted) {
      problemBySlug.set(p.slug, { id: p.id, slug: p.slug });
    }
  }

  // 5. Fetch existing relationships
  const existingRels = await prisma.companyProblem.findMany({ select: { companyId: true, problemId: true } });
  const existingRelSet = new Set(existingRels.map((r) => `${r.companyId}:${r.problemId}`));

  const relsToInsert: { companyId: number; problemId: number }[] = [];
  const seenPairSet = new Set<string>();

  for (const pair of companyProblemPairs) {
    const problem = problemBySlug.get(pair.problemSlug);
    if (!problem) continue;

    const key = `${pair.companyId}:${problem.id}`;
    if (!existingRelSet.has(key) && !seenPairSet.has(key)) {
      seenPairSet.add(key);
      relsToInsert.push({ companyId: pair.companyId, problemId: problem.id });
    }
  }

  console.log(`New company-problem relationships to insert: ${relsToInsert.length}`);

  let relsCreated = 0;
  for (const batch of chunk(relsToInsert, 1000)) {
    const res = await prisma.companyProblem.createMany({
      data: batch,
      skipDuplicates: true,
    });
    relsCreated += res.count;
  }

  console.log(`Successfully created ${relsCreated} new company-problem relationships.`);

  // 6. Summary verification
  const [finalCompanies, finalProblems, finalRelationships] = await Promise.all([
    prisma.company.count(),
    prisma.problem.count(),
    prisma.companyProblem.count(),
  ]);

  console.log("");
  console.log("=== MERGE COMPLETE ===");
  console.log(`Companies in DB: ${finalCompanies}`);
  console.log(`Problems in DB: ${finalProblems} (+${newProblems.length} newly added)`);
  console.log(`Relationships in DB: ${finalRelationships} (+${relsCreated} newly added)`);

  await disconnect();
}

main().catch(async (e) => {
  console.error("Merge script failed:", e);
  await disconnect();
  process.exit(1);
});
