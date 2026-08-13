import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export interface DiscoveredCompany {
  name: string;
  directory: string;
  csvFiles: string[];
}

const SKIPPED_ENTRIES = new Set([".git", "Readme.md", "README.md", ".gitignore"]);

export function discoverCompanies(dataDir: string): DiscoveredCompany[] {
  const companies: DiscoveredCompany[] = [];

  let entries: string[];
  try {
    entries = readdirSync(dataDir);
  } catch (error) {
    throw new Error(`Data directory not found at "${dataDir}": ${(error as Error).message}`);
  }

  for (const entry of entries) {
    if (SKIPPED_ENTRIES.has(entry)) {
      continue;
    }
    const entryPath = join(dataDir, entry);
    if (!statSync(entryPath).isDirectory()) {
      continue;
    }

    let fileNames: string[];
    try {
      fileNames = readdirSync(entryPath);
    } catch {
      continue;
    }

    const csvFiles = fileNames
      .filter((fileName) => fileName.toLowerCase().endsWith(".csv"))
      .map((fileName) => join(entryPath, fileName));

    if (csvFiles.length === 0) {
      continue;
    }

    companies.push({ name: entry, directory: entryPath, csvFiles });
  }

  return companies.sort((a, b) => a.name.localeCompare(b.name));
}
