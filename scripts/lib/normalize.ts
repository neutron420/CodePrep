import type { Difficulty } from "../../app/generated/prisma/enums";

const LEETCODE_PROBLEM_URL_PATTERN = /^https:\/\/(www\.)?leetcode\.com\/problems\/([a-z0-9][a-z0-9-]*)\/?$/i;

export type NormalizedDifficulty = Difficulty;

const DIFFICULTY_MAP: Record<string, Difficulty> = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
};

export function normalizeDifficulty(raw: string | undefined): Difficulty | null {
  if (!raw) {
    return null;
  }
  const normalized = raw.trim().toUpperCase();
  return DIFFICULTY_MAP[normalized] ?? null;
}

export interface NormalizedProblemUrl {
  url: string;
  slug: string;
}

export function normalizeProblemUrl(raw: string | undefined): NormalizedProblemUrl | null {
  if (!raw) {
    return null;
  }
  const match = LEETCODE_PROBLEM_URL_PATTERN.exec(raw.trim());
  if (!match) {
    return null;
  }
  const slug = match[2].toLowerCase();
  return { url: `https://leetcode.com/problems/${slug}`, slug };
}

export function slugifyCompanyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
