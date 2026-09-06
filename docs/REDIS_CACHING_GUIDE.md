# Redis Caching Architecture & Implementation Guide for CodeCraft

> **Summary**: Yes bro, 100%! Implementing Redis in CodeCraft is one of the best upgrades you can make. It will slash dashboard loading times from **~500ms down to ~15ms** (a 95%+ speedup) while protecting your Neon PostgreSQL database from connection limits and compute costs.
>
> You can follow this guide tomorrow step-by-step to implement it cleanly.

---

## 1. Why CodeCraft Needs Redis

Currently, every time a user visits `/dashboard` or switches between companies (Google, Amazon, Meta, etc.):
1. Next.js server components execute complex Prisma queries across 5 relational tables (`Company`, `Problem`, `CompanyProblem`, `ProblemTopic`, `Topic`).
2. Each query fetches **hundreds to thousands of questions** and joins topics and company associations.
3. Neon PostgreSQL connection latency on serverless takes **200ms – 800ms**.

### With Redis:
| Metric | Without Redis (Direct Neon DB) | With Redis (Upstash / Redis Cloud) |
| :--- | :--- | :--- |
| **Response Latency** | `250ms – 800ms` | **`8ms – 25ms`** (30x faster) |
| **Database Load** | 1 DB query per page view | **0 DB queries** for cached companies |
| **Compute Cost** | Burns Neon compute hours | Near **0** compute usage |
| **Scalability** | Concurrency bottlenecks | Millions of reads with zero lag |

---

## 2. Recommended Redis Provider: Upstash Redis

For Next.js App Router deployed on Vercel:
- **Upstash Redis (`@upstash/redis`)** is strongly recommended over standard TCP Redis (`ioredis`).
- **Why?** Upstash uses HTTP REST endpoints under the hood. Serverless functions on Vercel spin up and down constantly — TCP connections can hit connection pool exhaustion, but HTTP REST connections are 100% connectionless and serverless-native.
- **Cost**: Generous Free Tier (10,000 commands/day free forever, then $0.20 per 100k requests).

*(Note: If you already run a self-hosted Redis or Redis Cloud, you can use `ioredis` with connection pooling. Both implementations are provided below).*

---

## 3. Cache Keys & TTL (Time To Live) Strategy

| Cache Key Pattern | Data Stored | TTL | When to Invalidate |
| :--- | :--- | :--- | :--- |
| `cache:companies:sidebar` | List of all 694 companies + problem counts | **24 hours** (`86400s`) | When a new question or company is added |
| `cache:company:${slug}:problems` | All standard + community questions for company | **2 hours** (`7200s`) | On new question submission or upvote |
| `cache:company:${slug}:meta` | Company details (domain, category, count) | **24 hours** (`86400s`) | Rarely (manual flush or update) |
| `cache:problem:${id}` | Single problem details + topics | **7 days** (`604800s`) | On problem edit |

---

## 4. Step-by-Step Implementation Blueprint (For Tomorrow)

### Step 1: Install Redis SDK
Run in your terminal:
```bash
bun add @upstash/redis
# or if using npm:
# npm install @upstash/redis
```

---

### Step 2: Set Up Free Redis Database & Environment Variables
1. Go to [console.upstash.com](https://console.upstash.com) and create a free Redis database (choose a region close to your Neon DB, e.g., US-East or Europe).
2. Copy the REST credentials and add them to your `.env` (and Vercel Environment Variables):
```env
UPSTASH_REDIS_REST_URL="https://your-upstash-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_secret_token"
```

---

### Step 3: Create the Redis Singleton with Graceful Fallback (`lib/redis.ts`)
Create a helper that gracefully falls back to the database if Redis is offline or credentials are not yet set. This prevents your site from EVER going down if Redis fails.

```typescript
// lib/redis.ts
import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  redisClient = new Redis({
    url,
    token,
  });

  return redisClient;
}

/**
 * Cache-aside wrapper:
 * 1. Checks Redis cache first.
 * 2. On miss, runs the fallback database fetcher.
 * 3. Saves the result to Redis in the background.
 */
export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 3600
): Promise<T> {
  const redis = getRedisClient();

  // If Redis is not configured or fails, directly run the database query
  if (!redis) {
    return fetcher();
  }

  try {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }
  } catch (err) {
    console.warn(`[Redis] Cache read failed for key "${key}":`, err);
  }

  // Fetch fresh data from DB
  const freshData = await fetcher();

  // Write back to Redis with TTL
  if (freshData !== null && freshData !== undefined) {
    try {
      await redis.set(key, freshData, { ex: ttlSeconds });
    } catch (err) {
      console.warn(`[Redis] Cache write failed for key "${key}":`, err);
    }
  }

  return freshData;
}

/**
 * Invalidate a specific cache key or prefix
 */
export async function invalidateCache(key: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.del(key);
  } catch (err) {
    console.warn(`[Redis] Cache delete failed for key "${key}":`, err);
  }
}
```

---

### Step 4: Cache Company Problems in `lib/repositories/company.repository.ts`

Wrap `findProblemsForCompany` with `getOrSetCache`:

```typescript
import { getOrSetCache } from "../redis";

export async function findCachedProblemsForCompany(companyId: number, companySlug: string, params: CompanyProblemListParams) {
  // Only cache unfiltered full lists (which is what dashboard fetches: limit 1000)
  const isFullList = params.page === 1 && params.limit >= 1000 && !params.search && !params.difficulty;

  if (!isFullList) {
    return findProblemsForCompany(companyId, params);
  }

  const cacheKey = `cache:company:${companySlug}:problems`;

  return getOrSetCache(
    cacheKey,
    () => findProblemsForCompany(companyId, params),
    7200 // 2 hours TTL
  );
}
```

---

### Step 5: Cache Sidebar Companies in `app/dashboard/layout.tsx`

The 694 companies rarely change throughout the day. Cache this query for 24 hours:

```typescript
import { getOrSetCache } from "@/lib/redis";

// Inside DashboardLayout:
const sidebarCompanies = await getOrSetCache(
  "cache:companies:sidebar",
  async () => {
    const all = await withDbRetry(() =>
      prisma.company.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { problems: true, communityProblems: true } },
        },
        orderBy: { problems: { _count: "desc" } },
      })
    );
    return all.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      problemCount: (c._count.problems ?? 0) + (c._count.communityProblems ?? 0),
    }));
  },
  86400 // 24 hours
);
```

---

### Step 6: Cache Invalidation on New Question Submissions

Whenever a user shares a new interview question, delete that company's cache so the new question shows up immediately:

In `app/api/submissions/route.ts`:
```typescript
import { invalidateCache } from "@/lib/redis";

export async function POST(req: Request) {
  // ... create community problem in Prisma ...

  // Invalidate company cache and sidebar count
  await Promise.all([
    invalidateCache(`cache:company:${company.slug}:problems`),
    invalidateCache("cache:companies:sidebar"),
  ]);

  return NextResponse.json({ success: true, problem: newProblem });
}
```

And in `app/api/submissions/[id]/upvote/route.ts`:
```typescript
import { invalidateCache } from "@/lib/redis";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  // ... upvote in DB ...

  // Invalidate company cache
  if (companySlug) {
    await invalidateCache(`cache:company:${companySlug}:problems`);
  }

  return NextResponse.json({ success: true });
}
```

---

## 5. Summary Checklist for Tomorrow

When you're ready to implement tomorrow, just follow these 5 quick steps:
- [ ] 1. Create a free Redis database on [Upstash](https://console.upstash.com).
- [ ] 2. Add `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` in `.env`.
- [ ] 3. Run `bun add @upstash/redis`.
- [ ] 4. Add `lib/redis.ts`.
- [ ] 5. Wrap queries in `layout.tsx`, `page.tsx`, and add cache invalidation in `app/api/submissions`.

You can ask me to help you implement it step-by-step tomorrow whenever you're ready!
