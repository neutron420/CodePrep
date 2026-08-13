import type { Prisma } from "../../app/generated/prisma/client";

import { parseCsvFile, type CsvRow } from "./csv";
import type { DiscoveredCompany } from "./discover";
import { chunk, normalizeDifficulty, normalizeProblemUrl, slugifyCompanyName } from "./normalize";
import { prisma } from "./prisma";

export interface RawProblem {
  difficulty: "EASY" | "MEDIUM" | "HARD";
  title: string;
  url: string;
  slug: string;
}

export interface ProblemRef extends RawProblem {
  id: number;
}

export interface InvalidRow {
  company: string;
  file: string;
  line: number;
  reason: string;
}

export interface ImportCounters {
  companiesFound: number;
  companiesCreated: number;
  companiesExisting: number;
  problemsCreated: number;
  problemsReused: number;
  relationshipsCreated: number;
  relationshipsSkipped: number;
  rowsParsed: number;
  rowsInvalid: number;
  csvFilesFailed: number;
  companiesFailed: number;
  invalidSamples: InvalidRow[];
}

export function createCounters(): ImportCounters {
  return {
    companiesFound: 0,
    companiesCreated: 0,
    companiesExisting: 0,
    problemsCreated: 0,
    problemsReused: 0,
    relationshipsCreated: 0,
    relationshipsSkipped: 0,
    rowsParsed: 0,
    rowsInvalid: 0,
    csvFilesFailed: 0,
    companiesFailed: 0,
    invalidSamples: [],
  };
}

export function rowToRawProblem(row: CsvRow, company: string, file: string, line: number, counters: ImportCounters): RawProblem | null {
  const difficulty = normalizeDifficulty(row.Difficulty);
  if (!difficulty) {
    recordInvalidRow(counters, { company, file, line, reason: `Invalid or missing difficulty: "${row.Difficulty ?? ""}"` });
    return null;
  }

  const normalizedUrl = normalizeProblemUrl(row.Link);
  if (!normalizedUrl) {
    recordInvalidRow(counters, { company, file, line, reason: `Invalid or missing LeetCode link: "${row.Link ?? ""}"` });
    return null;
  }

  const title = row.Title?.trim();
  if (!title) {
    recordInvalidRow(counters, { company, file, line, reason: "Missing problem title" });
    return null;
  }

  return { difficulty, title, url: normalizedUrl.url, slug: normalizedUrl.slug };
}

function recordInvalidRow(counters: ImportCounters, invalid: InvalidRow): void {
  counters.rowsInvalid += 1;
  if (counters.invalidSamples.length < 20) {
    counters.invalidSamples.push(invalid);
  }
}

export function collectCompanyProblems(company: DiscoveredCompany, counters: ImportCounters): Map<string, RawProblem> {
  const problems = new Map<string, RawProblem>();

  for (const csvFile of company.csvFiles) {
    const { records, error } = parseCsvFile(csvFile);
    if (error) {
      counters.csvFilesFailed += 1;
      recordInvalidRow(counters, { company: company.name, file: csvFile, line: 0, reason: error });
      continue;
    }

    for (const { record, line } of records) {
      counters.rowsParsed += 1;
      const problem = rowToRawProblem(record, company.name, csvFile, line, counters);
      if (problem) {
        problems.set(problem.slug, problem);
      }
    }
  }

  return problems;
}

export interface UpsertCompaniesResult {
  bySlug: Map<string, { id: number; name: string }>;
  created: number;
  existing: number;
}

export async function upsertCompanies(names: string[]): Promise<UpsertCompaniesResult> {
  const bySlug = new Map<string, { id: number; name: string }>();
  const existing = await prisma.company.findMany({ select: { id: true, name: true, slug: true } });
  for (const company of existing) {
    bySlug.set(company.slug, { id: company.id, name: company.name });
  }

  const toCreate: Prisma.CompanyCreateManyInput[] = [];
  for (const name of names) {
    const slug = slugifyCompanyName(name);
    if (!bySlug.has(slug)) {
      toCreate.push({ name, slug });
    }
  }

  let created = 0;
  for (const batch of chunk(toCreate, 500)) {
    const result = await prisma.company.createMany({ data: batch, skipDuplicates: true });
    created += result.count;
  }

  if (created > 0) {
    const inserted = await prisma.company.findMany({
      where: { slug: { in: toCreate.map((c) => c.slug) } },
      select: { id: true, name: true, slug: true },
    });
    for (const company of inserted) {
      bySlug.set(company.slug, { id: company.id, name: company.name });
    }
  }

  return { bySlug, created, existing: bySlug.size - created };
}

export interface UpsertProblemsResult {
  bySlug: Map<string, ProblemRef>;
  created: number;
  reused: number;
}

export async function upsertProblems(problems: Map<string, RawProblem>): Promise<UpsertProblemsResult> {
  const bySlug = new Map<string, ProblemRef>();

  const existing = await prisma.problem.findMany({
    select: { id: true, title: true, slug: true, difficulty: true, leetcodeUrl: true, leetcodeId: true },
  });
  for (const problem of existing) {
    bySlug.set(problem.slug, { ...problem, url: problem.leetcodeUrl });
  }

  const toCreate: Prisma.ProblemCreateManyInput[] = [];
  let reused = 0;
  for (const problem of problems.values()) {
    if (bySlug.has(problem.slug)) {
      reused += 1;
    } else {
      toCreate.push({ leetcodeId: problem.slug, title: problem.title, slug: problem.slug, difficulty: problem.difficulty, leetcodeUrl: problem.url });
    }
  }

  let created = 0;
  for (const batch of chunk(toCreate, 500)) {
    const result = await prisma.problem.createMany({ data: batch, skipDuplicates: true });
    created += result.count;
  }

  if (created > 0) {
    const inserted = await prisma.problem.findMany({
      where: { slug: { in: toCreate.map((p) => p.slug) } },
      select: { id: true, title: true, slug: true, difficulty: true, leetcodeUrl: true, leetcodeId: true },
    });
    for (const problem of inserted) {
      bySlug.set(problem.slug, { ...problem, url: problem.leetcodeUrl });
    }
  }

  return { bySlug, created, reused };
}

export interface UpsertRelationshipsResult {
  created: number;
  skipped: number;
}

export async function upsertRelationships(pairs: { companyId: number; problemId: number }[]): Promise<UpsertRelationshipsResult> {
  let created = 0;
  const existing = await prisma.companyProblem.findMany({ select: { companyId: true, problemId: true } });
  const existingKeys = new Set(existing.map((r) => `${r.companyId}:${r.problemId}`));

  const toCreate: Prisma.CompanyProblemCreateManyInput[] = [];
  let skipped = 0;
  for (const pair of pairs) {
    const key = `${pair.companyId}:${pair.problemId}`;
    if (existingKeys.has(key)) {
      skipped += 1;
    } else {
      toCreate.push(pair);
    }
  }

  for (const batch of chunk(toCreate, 1000)) {
    const result = await prisma.companyProblem.createMany({ data: batch, skipDuplicates: true });
    created += result.count;
  }

  return { created, skipped };
}
