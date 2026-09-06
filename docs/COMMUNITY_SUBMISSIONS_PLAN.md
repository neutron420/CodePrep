# Crowdsourced Multi-Platform Interview Question Submissions

Enable students and job seekers who recently took an interview or Online Assessment (OA) at any company to submit questions asked during their interview. The submitted question is automatically saved under that company and displayed alongside standard problems in the company's problem list, supporting all major coding platforms (**LeetCode, GeeksforGeeks, Codeforces, HackerRank, CodeStudio, and Custom**).

---

## 1. Feature Architecture Overview

```
[Student / User] 
       │
       ▼
[Click "+ Share Question" on Company Page]
       │
       ▼
[Submit Form]
  ├── Company: (e.g. Google, Adobe, TCS)
  ├── Platform: LeetCode | GeeksforGeeks | Codeforces | HackerRank | CodeStudio | Custom
  ├── Problem Title & URL
  ├── Difficulty: Easy | Medium | Hard
  ├── Round: OA | Technical Round 1 | Technical Round 2
  └── Topics: BFS, DFS, Dynamic Programming, etc.
       │
       ▼
[POST /api/submissions]
       │
       ▼
[PostgreSQL Database via Prisma]
  └── model CommunityProblem { companyId, platform, title, problemUrl, difficulty, roundType, topics, upvotes }
       │
       ▼
[Company Problem Grid & Table]
  └── Appears immediately in the company's problem list with Platform badge (LC, GFG, HR, CF) + "Community Reported" tag!
```

---

## 2. Database Schema Extension (Prisma)

```prisma
enum CodingPlatform {
  LEETCODE
  GEEKSFORGEEKS
  CODECHEF
  ATCODER
  CODEFORCES
  HACKERRANK
  HACKEREARTH
  CODESTUDIO
  INTERVIEWBIT
  CUSTOM
}

model CommunityProblem {
  id          Int            @id @default(autoincrement())
  companyId   Int            // Required: The company where it was asked
  userId      String?        // Optional: Firebase UID if logged in
  platform    CodingPlatform @default(LEETCODE) // Required: Platform (LeetCode, GFG, CodeChef, etc.)
  title       String         // Required: Problem title
  problemUrl  String?        // URL to problem (Required in form for public platforms)
  difficulty  Difficulty     @default(MEDIUM)   // Required: EASY, MEDIUM, HARD
  roundType   String         // Required: "OA", "Technical Round 1", "Technical Round 2", "HR/Managerial"
  topics      String[]       // Required: ["BFS", "Dynamic Programming"] (at least 1 topic)
  notes       String?        // Optional: Constraints, gotchas, or interview experience
  upvotes     Int            @default(1)
  createdAt   DateTime       @default(now())

  company     Company        @relation(fields: [companyId], references: [id], onDelete: Cascade)
  user        User?          @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([companyId])
  @@index([createdAt])
}
```

---

## 3. Key API Endpoints

1. **`POST /api/submissions`**:
   * Accepts submission payload, links to `companyId` via `companySlug`.
   * Saves to database and returns created item.
2. **`GET /api/companies/[slug]/problems`**:
   * Returns standard curated problems + community reported problems.
3. **`POST /api/submissions/[id]/upvote`**:
   * Increases the "I was also asked this (+1)" counter.

---

## 4. User Interface

* **"+ Share Question"** button placed prominently in the company banner and problem table controls.
* Clean white dialog modal with platform logos/pills:
  * 🟠 LeetCode
  * 🟢 GeeksforGeeks
  * 🔵 Codeforces
  * 🟣 CodeStudio
  * 🔴 HackerRank
* Interactive topic selector and instant feedback.
* In the problem table:
  * Platform badges (`[LC]`, `[GFG]`, `[HR]`) so students know where the problem comes from.
  * Direct clickable links to the coding platform.
