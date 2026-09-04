export interface ProblemItem {
  id: number;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  leetcodeUrl: string;
  topics: string[];
  companiesAsking?: { name: string; slug: string }[];
}
