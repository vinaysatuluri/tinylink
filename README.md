# TinyLink - Full Stack URL Shortener

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Prisma](https://img.shields.io/badge/Prisma-ORM-green) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

A robust, production-ready URL shortener built for performance and scalability. Features server-side redirection, atomic database updates for accurate analytics, and a real-time dashboard.

🔗 **Live Demo:** [https://tinylink-eta-eight.vercel.app](https://tinylink-eta-eight.vercel.app)

## 🚀 Key Features

* **URL Shortening:** Generate random 6-character codes or claim custom aliases.
* **High-Performance Redirection:** Server-side redirects (via Next.js Middleware/Server Components) for minimal latency.
* **Real-Time Analytics:** Tracks clicks and timestamps instantly.
* **Concurrency Safe:** Uses **Atomic Database Increments** to prevent race conditions during high-traffic spikes.
* **Strict Validation:** Enforces `[A-Za-z0-9]{6,8}` format for custom codes.
* **Auto-Refreshing Dashboard:** The UI updates click counts automatically every 5 seconds.
* **Conflict Handling:** Correctly handles duplicate codes with `409 Conflict` status.

## 🛠 Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Database:** PostgreSQL (via Neon Serverless)
* **ORM:** Prisma
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Deployment:** Vercel

## 🏗 Architecture & Design Decisions

### 1. Atomic Increments for Analytics
Instead of fetching the current click count and adding 1 in JavaScript (which leads to race conditions), I used Prisma's atomic operation:
```typescript
data: { clicks: { increment: 1 } }
This ensures 100% accuracy even if 1,000 users click the same link simultaneously.2. Server-Side RedirectionThe redirect logic lives in app/[code]/page.tsx. This allows the server to catch the request and send a 307/302 header immediately, which is faster and better for SEO than client-side useEffect redirects.3. Database IndexingThe shortCode column in the database is marked as @unique and indexed (@@index([shortCode])). This makes the lookup complexity O(1) (constant time), ensuring the redirect speed remains fast even with millions of records.📂 Project StructureBash├── app
│   ├── [code]           # Redirect Logic (Server Component)
│   ├── api/links        # API Endpoints (GET, POST, DELETE)
│   ├── code/[code]      # Single Link Stats Page
│   ├── healthz          # Health Check Endpoint
│   └── page.tsx         # Main Dashboard
├── components           # UI Components (Form, Table)
├── lib
│   ├── prisma.ts        # Singleton DB Client
│   └── utils.ts         # Regex Validators & Helpers
└── prisma
    └── schema.prisma    # Database Model
⚡️ Getting StartedClone the repoBashgit clone https://github.com/vinaysatuluri/tinylink.git

cd tinylink
Install dependenciesBashnpm install
Setup Environment VariablesCreate a .env file in the root:Code snippetDATABASE_URL="postgresql://user:password@host/db?sslmode=require"
Sync DatabaseBashnpx prisma db push
Run Development ServerBashnpm run dev
✅ API DocumentationThe application exposes RESTful endpoints for automated testing:MethodEndpointDescriptionPOST/api/linksCreate a link. Returns 409 if code exists.GET/api/linksFetch all links.GET/api/links/:codeGet stats for a specific code.DELETE/api/links/:codeDelete a link.GET/healthzSystem health check (Returns 200 OK).Built by Vinay Satuluri.
### Step 2: Push to GitHub
Go to your terminal and run:

```bash
git add .
git commit -m "Add professional documentation"
git push origin main
Step 3: Check the ResultGo to your GitHub repository link in your browser. You will see the README.md has transformed into a beautiful front page for your project.You are fully done! Congratulations! 🏆