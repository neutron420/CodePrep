# Frontend Component Specification: Community Question Submissions

This document outlines everything needed on the frontend to build the interview question submission and display features for **CodeCraft**. You can feed this specification directly to **ChatGPT, Claude, or v0** to generate the frontend components.

---

## 1. What Components Are Needed?

You need **two main UI pieces**:

1. **`SubmitQuestionDialog.tsx` (The Modal Form)**:
   * Opens when clicking the **"+ Share Question"** button.
   * Collects interview details (Company, Coding Platform, Problem Title, URL, Difficulty, Round Type, Topics, Notes).
   * Submits data to `POST /api/submissions`.

2. **Problem Row Updates (In `company-problem-grid.tsx`)**:
   * **Platform Badge**: Shows where the problem is from (`[LeetCode]`, `[GFG]`, `[CodeChef]`, `[AtCoder]`, `[Codeforces]`, `[HackerRank]`, etc.).
   * **Upvote Button**: A clickable `+1` badge (*"I was also asked this (12)"*) that calls `POST /api/submissions/[id]/upvote`.
   * **Filter Pill**: Optional filter tab to view *All*, *Core LeetCode*, or *Recent OA / Community*.

---

## 2. Specification for `SubmitQuestionDialog.tsx`

### Props
```typescript
interface SubmitQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCompanySlug?: string; // Pre-fills if opened from a specific company page
  defaultCompanyName?: string;
  onSuccess?: () => void;      // Callback to refresh problem list
}
```

### Form Fields & State
| Field Name | Type | Required? | UI Element | Options / Values |
|---|---|---|---|---|
| **`companySlug`** | `string` | **Yes** | Searchable Select / Pill | Selected company (e.g., `google`, `adobe`, `tcs`) |
| **`platform`** | `enum` | **Yes** | Clickable Pill Selector | `LEETCODE`, `GEEKSFORGEEKS`, `CODECHEF`, `ATCODER`, `CODEFORCES`, `HACKERRANK`, `HACKEREARTH`, `CODESTUDIO`, `INTERVIEWBIT`, `CUSTOM` |
| **`title`** | `string` | **Yes** | Text Input | Problem title (min 2 chars) |
| **`problemUrl`** | `string` | Optional | URL Input | e.g. `https://leetcode.com/problems/...` |
| **`difficulty`** | `enum` | **Yes** | 3 Segmented Buttons | `EASY` (green), `MEDIUM` (amber), `HARD` (rose) |
| **`roundType`** | `string` | **Yes** | Quick-click Chips | `Online Assessment (OA)`, `Technical Round 1`, `Technical Round 2`, `HR / Managerial` |
| **`topics`** | `string[]` | **Yes (min 1)** | Multi-select Pills | `Array`, `String`, `BFS`, `DFS`, `Dynamic Programming`, `Trees`, `Graphs`, `Two Pointers`, `Binary Search`, `Greedy`, `Trie` |
| **`notes`** | `string` | Optional | Textarea | Constraints, gotchas, or interview experience hints |
| **`isAnonymous`** | `boolean` | Optional | Checkbox / Switch | Post anonymously vs with user profile |

---

## 3. Backend API Contract

### Submission Endpoint
* **URL**: `/api/submissions`
* **Method**: `POST`
* **Headers**: `{ "Content-Type": "application/json" }`
* **Request Payload**:
```json
{
  "companySlug": "adobe",
  "platform": "CODECHEF",
  "title": "Minimum Operations to Make Array Equal",
  "problemUrl": "https://www.codechef.com/problems/MINOPS",
  "difficulty": "MEDIUM",
  "roundType": "Online Assessment (OA)",
  "topics": ["Array", "Greedy"],
  "notes": "Asked in On-Campus Adobe OA Sept 2026",
  "userId": "firebase_user_uid_or_null"
}
```
* **Success Response (HTTP 201)**:
```json
{
  "success": true,
  "message": "Interview question submitted successfully",
  "submission": {
    "id": 1,
    "title": "Minimum Operations to Make Array Equal",
    "platform": "CODECHEF",
    "difficulty": "MEDIUM",
    "roundType": "Online Assessment (OA)",
    "upvotes": 1
  }
}
```

---

### Upvote Endpoint
* **URL**: `/api/submissions/[id]/upvote`
* **Method**: `POST`
* **Success Response (HTTP 200)**:
```json
{
  "success": true,
  "upvotes": 2
}
```

---

## 4. Platform Brand Colors for UI Badges

| Platform | Badge Text | Color Theme |
|---|---|---|
| `LEETCODE` | `LeetCode` | Orange (`bg-amber-500/10 text-amber-600 border-amber-500/30`) |
| `GEEKSFORGEEKS` | `GFG` | Emerald (`bg-emerald-500/10 text-emerald-600 border-emerald-500/30`) |
| `CODECHEF` | `CodeChef` | Amber/Brown (`bg-yellow-600/10 text-yellow-700 border-yellow-600/30`) |
| `ATCODER` | `AtCoder` | Slate/Cyan (`bg-cyan-500/10 text-cyan-600 border-cyan-500/30`) |
| `CODEFORCES` | `Codeforces` | Blue/Red (`bg-blue-500/10 text-blue-600 border-blue-500/30`) |
| `HACKERRANK` | `HackerRank` | Green (`bg-green-500/10 text-green-600 border-green-500/30`) |
| `HACKEREARTH` | `HackerEarth` | Indigo (`bg-indigo-500/10 text-indigo-600 border-indigo-500/30`) |
| `CODESTUDIO` | `CodeStudio` | Purple (`bg-purple-500/10 text-purple-600 border-purple-500/30`) |
| `INTERVIEWBIT` | `InterviewBit` | Teal (`bg-teal-500/10 text-teal-600 border-teal-500/30`) |
| `CUSTOM` | `Direct Q` | Zinc (`bg-zinc-500/10 text-zinc-600 border-zinc-500/30`) |

---

## 5. Ready-to-Use Prompt to Feed into AI (v0 / ChatGPT / Claude)

You can copy and paste the prompt below directly into ChatGPT, v0, or Claude to generate the React component:

```markdown
Create a sleek, modern React component named `SubmitQuestionDialog.tsx` using Tailwind CSS and shadcn/ui Dialog.

Features needed:
1. Modal opens with a clean white card and dark blurred backdrop.
2. Platform Picker: Clickable pill selector for platforms:
   - LeetCode, GeeksforGeeks, CodeChef, AtCoder, Codeforces, HackerRank, HackerEarth, CodeStudio, InterviewBit, Custom/Direct.
   Clicking one highlights it with subtle brand color.
3. Problem Title (input, required) & Problem URL (input, optional).
4. Difficulty Picker: 3 segmented buttons: Easy (green), Medium (amber), Hard (rose).
5. Interview Round Chips: Quick-click buttons for:
   "Online Assessment (OA)", "Technical Round 1", "Technical Round 2", "HR / Managerial".
6. Topic Tags: Multi-select clickable pills (Array, String, BFS, DFS, Dynamic Programming, Trees, Graphs, Two Pointers, Binary Search, Greedy, Trie). Clicking toggles selection.
7. Notes / Hints: Textarea (optional).
8. Anonymous Toggle: "Post Anonymously" switch.
9. On submit, send a POST request to `/api/submissions` with JSON payload:
   { companySlug, platform, title, problemUrl, difficulty, roundType, topics, notes, userId }.
10. Show loading state on button and a clean toast on success, then close the modal.
```
