import "dotenv/config";

import { resolve } from "node:path";

import { discoverCompanies } from "./lib/discover";
import {
  collectCompanyProblems,
  createCounters,
  upsertCompanies,
  upsertProblems,
  upsertRelationships,
  type ImportCounters,
  type RawProblem,
} from "./lib/import-data";
import { slugifyCompanyName } from "./lib/normalize";
import { disconnect } from "./lib/prisma";

const DEFAULT_DATA_DIR = "data/leetcode-company-wise-problems";
const PROGRESS_INTERVAL = 50;

function log(message: string): void {
  console.log(message);
}

function formatCounters(counters: ImportCounters): void {
  log("");
  log("Import summary");
  log("==============");
  log(`Companies processed : ${counters.companiesFound}`);
  log(`Companies created   : ${counters.companiesCreated}`);
  log(`Companies existing  : ${counters.companiesExisting}`);
  log(`Problems created    : ${counters.problemsCreated}`);
  log(`Problems reused     : ${counters.problemsReused}`);
  log(`Relationships made  : ${counters.relationshipsCreated}`);
  log(`Relationships skipped: ${counters.relationshipsSkipped}`);
  log(`Rows parsed         : ${counters.rowsParsed}`);
  log(`Rows invalid        : ${counters.rowsInvalid}`);
  log(`CSV files failed    : ${counters.csvFilesFailed}`);

  if (counters.invalidSamples.length > 0) {
    log("");
    log("Sample of skipped/invalid rows:");
    for (const sample of counters.invalidSamples) {
      log(`  - ${sample.company} (${sample.file.replace(/\\/g, "/").split("/").slice(-2).join("/")}:${sample.line}) ${sample.reason}`);
    }
    if (counters.rowsInvalid > counters.invalidSamples.length) {
      log(`  ... and ${counters.rowsInvalid - counters.invalidSamples.length} more.`);
    }
  }
}

async function importData(dataDir: string): Promise<void> {
  const counters = createCounters();

  log(`Discovering companies in ${dataDir}...`);
  const companies = discoverCompanies(dataDir);
  counters.companiesFound = companies.length;
  log(`Found ${companies.length} company folders.`);

  log("");
  log("Collecting problems from CSV files...");
  const companyProblems = new Map<string, Map<string, RawProblem>>();
  for (const company of companies) {
    const problems = collectCompanyProblems(company, counters);
    companyProblems.set(company.name, problems);
  }
  log(`Parsed ${counters.rowsParsed} rows, ${counters.rowsInvalid} invalid.`);

  log("");
  log("Upserting companies...");
  const companiesResult = await upsertCompanies(companies.map((company) => company.name));
  counters.companiesCreated = companiesResult.created;
  counters.companiesExisting = companiesResult.existing;
  log(`Companies created: ${companiesResult.created}, existing: ${companiesResult.existing}.`);

  log("");
  log("Upserting problems...");
  const allProblems = new Map<string, RawProblem>();
  for (const problems of companyProblems.values()) {
    for (const [slug, problem] of problems) {
      allProblems.set(slug, problem);
    }
  }
  const problemsResult = await upsertProblems(allProblems);
  counters.problemsCreated = problemsResult.created;
  counters.problemsReused = problemsResult.reused;
  log(`Problems created: ${problemsResult.created}, reused: ${problemsResult.reused}.`);

  log("");
  log("Upserting company-problem relationships...");
  const pairs: { companyId: number; problemId: number }[] = [];
  let progress = 0;
  for (const company of companies) {
    const companyRecord = companiesResult.bySlug.get(slugifyCompanyName(company.name));
    if (!companyRecord) {
      counters.companiesFailed += 1;
      continue;
    }
    const problems = companyProblems.get(company.name);
    if (!problems) {
      continue;
    }
    for (const slug of problems.keys()) {
      const problem = problemsResult.bySlug.get(slug);
      if (problem) {
        pairs.push({ companyId: companyRecord.id, problemId: problem.id });
      }
    }
    progress += 1;
    if (progress % PROGRESS_INTERVAL === 0) {
      log(`  Processed ${progress}/${companies.length} companies...`);
    }
  }
  const relationshipsResult = await upsertRelationships(pairs);
  counters.relationshipsCreated = relationshipsResult.created;
  counters.relationshipsSkipped = relationshipsResult.skipped;
  log(`Relationships created: ${relationshipsResult.created}, skipped: ${relationshipsResult.skipped}.`);

  formatCounters(counters);
}

async function main(): Promise<void> {
  const dataDir = resolve(process.env["LEETCODE_DATA_DIR"] ?? DEFAULT_DATA_DIR);

  try {
    await importData(dataDir);
  } catch (error) {
    console.error("Import failed:", error);
    process.exitCode = 1;
  } finally {
    await disconnect();
  }
}

main();
