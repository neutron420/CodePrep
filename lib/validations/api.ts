import { z } from "zod";

export const difficultySchema = z.enum(["EASY", "MEDIUM", "HARD"]);
export const orderSchema = z.enum(["asc", "desc"]);

const paginationSchema = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  order: orderSchema.default("asc"),
};

const searchSchema = {
  search: z
    .string()
    .trim()
    .max(100)
    .optional()
    .default("")
    .transform((value) => (value === "" ? undefined : value)),
};

const difficultySchemaOptional = difficultySchema.optional();

const optionalString = z.string().trim().min(1).optional();

export const listCompaniesQuerySchema = z.object({
  ...paginationSchema,
  ...searchSchema,
  sort: optionalString.default("name"),
});

export const listProblemsQuerySchema = z.object({
  ...paginationSchema,
  ...searchSchema,
  difficulty: difficultySchemaOptional,
  sort: optionalString.default("title"),
});

export const listCompanyProblemsQuerySchema = z.object({
  ...paginationSchema,
  ...searchSchema,
  difficulty: difficultySchemaOptional,
  sort: optionalString.default("title"),
});

export const listSolvedProblemsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  ...searchSchema,
});

export const companySortFields = new Set(["name", "problemCount"]);
export const problemSortFields = new Set(["title", "difficulty"]);

export type ListCompaniesQuery = z.infer<typeof listCompaniesQuerySchema>;
export type ListProblemsQuery = z.infer<typeof listProblemsQuerySchema>;
export type ListCompanyProblemsQuery = z.infer<typeof listCompanyProblemsQuerySchema>;
export type ListSolvedProblemsQuery = z.infer<typeof listSolvedProblemsQuerySchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
