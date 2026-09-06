<div align="center">

<img src="public/codecraft-logo-tight.png" alt="CodeCraft" height="48" />

<br /><br />

<p>
  <a href="https://codeprep-kappa.vercel.app"><strong>View Live Demo</strong></a>
  &nbsp;&middot;&nbsp;
  <a href="https://github.com/neutron420/CodePrep/issues"><strong>Report Bug</strong></a>
  &nbsp;&middot;&nbsp;
  <a href="https://github.com/neutron420/CodePrep/issues"><strong>Request Feature</strong></a>
</p>

<br />

<p>
  <img src="https://img.shields.io/badge/Next.js_16-000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Firebase-DD2C00?style=flat-square&logo=firebase&logoColor=white" alt="Firebase" />
  <img src="https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

</div>

---

## About

**CodeCraft** is a full-stack platform for software engineers preparing for coding interviews at top tech companies. It aggregates **1,000+ LeetCode problems** mapped across **100+ companies**, organized into **18 industry categories** — from FAANG and HFT firms to fintech and cybersecurity.

Instead of solving problems randomly, CodeCraft lets you focus on the exact questions that companies actually ask.

---

## Tech Stack

<table>
  <tr>
    <th align="center" width="120">Frontend</th>
    <th align="center" width="120">Backend</th>
    <th align="center" width="120">Auth</th>
    <th align="center" width="120">Infra</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://cdn.simpleicons.org/nextdotjs/white" width="30" /><br /><sub>Next.js 16</sub>
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="30" /><br /><sub>PostgreSQL</sub>
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg" width="30" /><br /><sub>Firebase Auth</sub>
    </td>
    <td align="center">
      <img src="https://cdn.simpleicons.org/vercel/white" width="30" /><br /><sub>Vercel</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="30" /><br /><sub>React 19</sub>
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg" width="30" /><br /><sub>Prisma ORM</sub>
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" width="30" /><br /><sub>Google OAuth</sub>
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="30" /><br /><sub>Git</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="30" /><br /><sub>TypeScript 5</sub>
    </td>
    <td align="center">
      <img src="https://cdn.simpleicons.org/neon" width="30" /><br /><sub>Neon DB</sub>
    </td>
    <td align="center">
      <img src="https://cdn.simpleicons.org/github/white" width="30" /><br /><sub>GitHub OAuth</sub>
    </td>
    <td align="center">
      <img src="https://cdn.simpleicons.org/bun" width="30" /><br /><sub>npm / bun</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="30" /><br /><sub>Tailwind CSS 4</sub>
    </td>
    <td align="center" colspan="3">
      <sub><b>UI:</b> shadcn/ui &middot; Lucide &middot; Recharts &middot; Motion &middot; Sonner &middot; TanStack Table</sub>
    </td>
  </tr>
</table>

---

## Features

**Problem Explorer**
- Browse 1,000+ LeetCode problems organized by company
- Filter by difficulty (Easy / Medium / Hard) and topic tags
- Switch between grid and list views
- Search across all 100+ companies with the Command Palette (`Ctrl+K`)

**Company Categories**
- 18 industry groups: FAANG, AI/ML, HFT, Banking, Cybersecurity, and more
- Collapsible sidebar with company logos and problem counts
- Pin target companies for quick access

**Authentication**
- Google and GitHub OAuth via Firebase
- Optional "Remember me for 7 days" session persistence
- Route guards that redirect unauthenticated users to login

**User Features**
- Mark problems as solved and track progress per company
- Target company pinning with cloud sync
- Responsive design optimized for desktop and mobile

---

## Database Schema

```
Company ──────┐
              ├── CompanyProblem ──┐
Problem ──────┘                    │
  |                                |
  ├── ProblemTopic ── Topic        |
  |                                |
  └── UserSolvedProblem ──┐        |
                          |        |
User ─────────────────────┤        |
                          └── UserTargetCompany
```

---

## Getting Started

### Prerequisites

- **Node.js 18+** or **Bun 1.0+**
- **PostgreSQL** database (or a [Neon](https://neon.tech) account)
- **Firebase** project with Authentication enabled

### Setup

```bash
# Clone the repo
git clone https://github.com/neutron420/CodePrep.git
cd CodePrep

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials (see below)

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate deploy

# Import problem data
bun scripts/import-leetcode-data.ts

# Start dev server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Firebase Server
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@your-project.iam.gserviceaccount.com"
```

---

## Project Structure

```
codeprep/
├── app/
│   ├── api/                    # REST API routes
│   │   ├── auth/               #   Auth sync endpoint
│   │   ├── companies/          #   Company data endpoints
│   │   └── problems/           #   Problem data endpoints
│   ├── dashboard/              # Main dashboard (sidebar + problem grid)
│   ├── login/                  # OAuth login page
│   └── page.tsx                # Landing page
├── components/
│   ├── templates/nova/         # Landing page sections
│   ├── ui/                     # shadcn/ui component primitives
│   ├── company-problem-grid    # Problem explorer (grid + list views)
│   ├── kodeprep-sidebar        # Company category sidebar
│   ├── login-form              # Google + GitHub OAuth form
│   ├── navbar-search           # Command palette search
│   └── user-nav                # User profile dropdown
├── lib/
│   ├── context/                # Auth context provider
│   ├── firebase/               # Firebase client config
│   ├── hooks/                  # Custom React hooks
│   └── repositories/           # Prisma data access layer
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # SQL migrations
└── public/                     # Static assets
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run database migrations |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:import` | Import LeetCode dataset |
| `npm run db:verify` | Verify database integrity |

---

## Deployment

Deployed on **Vercel** with automatic deployments from `master`.

Set all environment variables in **Vercel Dashboard** > **Settings** > **Environment Variables**.

---

## Contributing

```bash
# Fork the repo, then:
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request
```

---

## License

Open source under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built by <a href="https://github.com/neutron420">neutron420</a></sub>
</div>
