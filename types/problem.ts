export type CodingPlatformType =
  | "LEETCODE"
  | "GEEKSFORGEEKS"
  | "CODECHEF"
  | "ATCODER"
  | "CODEFORCES"
  | "HACKERRANK"
  | "HACKEREARTH"
  | "CODESTUDIO"
  | "INTERVIEWBIT"
  | "CUSTOM";

export interface ProblemItem {
  id: number;
  leetcodeNumber?: number | null;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  leetcodeUrl: string;
  topics: string[];
  companiesAsking?: { name: string; slug: string }[];
  platform?: CodingPlatformType;
  isCommunity?: boolean;
  roundType?: string;
  timeframe?: string | null;
  interviewMonth?: string | null;
  interviewYear?: number | null;
  interviewDate?: string | null;
  notes?: string | null;
  upvotes?: number;
  submittedBy?: { displayName: string | null; photoUrl: string | null } | null;
}
