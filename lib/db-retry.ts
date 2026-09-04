export async function withDbRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 300
): Promise<T> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err: unknown) {
      attempt++;
      if (attempt > retries) {
        throw err;
      }
      console.warn(`[DB Retry] Attempt ${attempt} failed, retrying in ${delayMs * attempt}ms...`);
      await new Promise((res) => setTimeout(res, delayMs * attempt));
    }
  }
  throw new Error("Database query failed after retries");
}
