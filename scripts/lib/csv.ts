import { readFileSync } from "node:fs";

import { parse } from "csv-parse/sync";

export interface CsvRow {
  Difficulty?: string;
  Title?: string;
  Link?: string;
  [column: string]: string | undefined;
}

export interface ParsedCsvRecord {
  record: CsvRow;
  line: number;
}

export interface CsvParseResult {
  records: ParsedCsvRecord[];
  error: string | null;
}

export function parseCsvFile(filePath: string): CsvParseResult {
  let content: string;
  try {
    content = readFileSync(filePath, "utf8");
  } catch (error) {
    return { records: [], error: `Failed to read file: ${(error as Error).message}` };
  }

  try {
    const parsed = parse(content, {
      columns: true,
      bom: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
      info: true,
    }) as { record: Record<string, string>; info: { lines: number } }[];

    return {
      records: parsed.map((entry) => ({ record: entry.record as CsvRow, line: entry.info.lines })),
      error: null,
    };
  } catch (error) {
    return { records: [], error: `Failed to parse CSV: ${(error as Error).message}` };
  }
}
