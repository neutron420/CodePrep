import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function okJson(data: unknown, status = 200): Response {
  return Response.json({ data }, { status });
}

export function errorJson(status: number, message: string): Response {
  return Response.json({ error: { message } }, { status });
}

export function handleApiError(error: unknown): Response {
  if (error instanceof ApiError) {
    return errorJson(error.status, error.message);
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    const message = firstIssue
      ? `${firstIssue.path.join(".") || "query"}: ${firstIssue.message}`
      : "Invalid query parameters";
    return errorJson(400, message);
  }

  console.error("Unhandled API error:", error);
  return errorJson(500, "Internal server error");
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function buildPagination(total: number, page: number, limit: number): PaginationInfo {
  return {
    page,
    limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  };
}
