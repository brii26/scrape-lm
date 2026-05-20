<div align="center">
   <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=260&color=0:0f172a,100:030712&text=scrape-lm&fontColor=ffffff&fontSize=62&desc=AI-Powered%20News%20Aggregator&descAlignY=76&descSize=17&descColor=7dd3fc" />
</div>

<div align="center">

<br/><br/>

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" />
<img src="https://img.shields.io/badge/Gin-00ADD8?style=for-the-badge&logo=go&logoColor=white" />
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
<img src="https://img.shields.io/badge/Claude_API-CC785C?style=for-the-badge&logo=anthropic&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
<img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" />

</div>

---

## About

scrape-lm is an AI-powered news aggregator that accepts natural language prompts, translates them into structured search queries using the Claude API, and scrapes Google News RSS in real time. Results are cached in Redis for 30 minutes, and each authenticated user gets a personalized quota, search history, and AI-curated prompt suggestions.

---

## Features

- **Natural Language Search**
  Type anything in plain English or any language. Claude API parses the prompt into a structured query with topic keywords, inclusion/exclusion filters, and sort preference, then forwards it to the Go backend.

- **Real-Time News Scraping**
  Fetches live articles from Google News RSS and decodes obfuscated article URLs using Google's batchexecute API. Each article is enriched with OG metadata including title, description, and cover image.

- **Redis Caching**
  Scraped results are cached for 30 minutes using a SHA-256 key derived from the topic. Subsequent queries for the same topic are served instantly from cache without hitting the scraper.

- **Per-Account Daily Quota**
  Each authenticated user gets 10 searches per day, tracked atomically in Redis with a 24-hour TTL. Cache hits do not count against the quota.

- **Search History**
  The last 20 searches per account are stored in a Redis List, persisted for 24 hours, and surfaced in the sidebar for one-click re-run.

- **AI Prompt Suggestions**
  The home screen surfaces 4 AI-curated search suggestions derived from live Google News headlines, refreshed every 5 minutes via an in-memory TTL store on the Next.js server.

- **Google OAuth Authentication**
  Authentication is handled by NextAuth with Google OAuth. On login, the backend issues a signed JWT stored as an httpOnly session cookie, validated by the Go auth middleware on every protected request.

- **Paginated News Feed**
  Results are paginated at 6 cards per page, up to 5 pages (30 articles max). Filters are applied in memory after cache retrieval, so pagination never triggers a re-scrape.

---

## Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| AI / NLP | Claude API, Haiku model (prompt translation, suggestions) |
| Backend | Go 1.24, Gin |
| Scraping | Google News RSS, net/http, batchexecute URL decoder |
| Cache | Redis 7 (news, quota, history, sessions) |
| Auth | NextAuth v5, Google OAuth 2.0, JWT (golang-jwt) |
| Deployment | Docker, Docker Compose, Nginx |

---

## Architecture

<div align="center">

> Architecture diagram placeholder, replace with `docs/architecture/architecture.png`

</div>

scrape-lm follows a layered architecture where the Next.js frontend acts as the orchestration layer. All browser-facing API calls go through Next.js API routes, which communicate with the Go backend over the internal Docker network. The browser never talks to Go directly.

### Request Flow

```
Browser
  │
  ├── POST /api/translate        (Next.js API route)
  │     └── Claude API           prompt → structured ScrapeQuery JSON
  │
  ├── POST /api/news             (Next.js API route)
  │     └── POST /api/scrape    (Go / Gin)
  │           ├── Redis GET      cache hit → return immediately
  │           └── Google News RSS
  │                 └── batchexecute decoder    resolve real article URLs
  │                       └── OG tag fetch      enrich with description + image
  │                             └── Redis SET   30 min TTL
  │
  ├── GET /api/quota             (Next.js → Go → Redis String)
  ├── GET /api/history           (Next.js → Go → Redis List)
  └── GET /api/suggestions       (Next.js → Claude API, 5 min in-memory TTL)
```

### Redis Key Schema

| Key Pattern | Type | TTL | Purpose |
|:---|:---|:---|:---|
| `<sha256(topic)>` | String (JSON) | 30 min | Cached news results |
| `quota:<userID>` | String (int) | 24 h | Daily search count per user |
| `history:<userID>` | List | 24 h | Last 20 searches per user |
| `session:<userID>` | String | 24 h | Backend JWT token |

### Quota and Cache Hit Logic

```
Incoming request
  │
  ├── quota >= 10?  → 429 Too Many Requests
  │
  ├── cache hit?
  │     ├── page 1 + results > 0  → append history only (no quota increment)
  │     └── return cached result
  │
  └── cache miss
        ├── scrape + store in Redis
        └── page 1 + results > 0  → increment quota + append history
```

---

## Screenshots

<div align="center">

> Application screenshots placeholder, replace with actual screenshots once available.

| Home | Results | History Sidebar |
|:---:|:---:|:---:|
| ![Home](docs/screenshots/home.png) | ![Results](docs/screenshots/results.png) | ![Sidebar](docs/screenshots/sidebar.png) |

</div>

---

## Setup and Run

> **Prerequisites:** Docker, Docker Compose

### Clone the repository

```bash
git clone https://github.com/brii26/scrape-lm.git
cd scrape-lm
```

### Configure environment

Copy the example env files and fill in your credentials.

```bash
cp backend/.env.example backend/.env.production
cp frontend/.env.example frontend/.env.production
```

**Backend (`backend/.env.production`):**
```env
PORT=8080
APP_ENV=production
REDIS_ADDR=redis:6379
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
ALLOWED_ORIGIN=https://yourdomain.com
```

**Frontend (`frontend/.env.production`):**
```env
AUTH_SECRET=your_auth_secret
NEXTAUTH_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_API_URL=http://backend:8080
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Run with Docker Compose

```bash
docker compose up -d --build
```

The app will be available at `http://localhost` via Nginx on port 80.

### Run locally (development)

```bash
# Terminal 1: Redis
docker run -p 6379:6379 redis:7-alpine

# Terminal 2: Backend
cd backend
go run ./cmd/main.go

# Terminal 3: Frontend
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
scrape-lm/
├── backend/
│   ├── cmd/main.go                   # Entry point, Gin router wiring
│   ├── config/config.go              # Env-based config loader
│   ├── internal/
│   │   ├── auth/                     # Google OAuth callback, JWT issuance
│   │   ├── cache/                    # Redis client, quota, history, session
│   │   ├── middleware/               # Auth, CORS, logger, rate limiter
│   │   ├── news/                     # Handler, service, routes
│   │   └── scraper/                  # RSS fetch, OG enrichment, URL decoder
│   └── pkg/
│       ├── hash/                     # SHA-256 cache key generator
│       ├── response/                 # Unified JSON envelope
│       └── types/                    # Shared ScrapeQuery, NewsItem types
├── frontend/
│   ├── app/
│   │   ├── (auth)/                   # Login page
│   │   ├── (main)/                   # Protected pages (home, news)
│   │   └── api/                      # Next.js API routes (proxy + AI)
│   ├── components/
│   │   ├── features/                 # NewsCard, NewsGrid, PromptSection
│   │   ├── layout/                   # Navbar, Sidebar, Footer, MainShell
│   │   └── ui/                       # Toast, Spinner, Cursor
│   ├── context/                      # Toast, SearchHistory, Suggestions
│   ├── hooks/                        # useSearchHistory, useAuth
│   ├── lib/                          # api.ts, auth.ts, types.ts, validations.ts
│   └── middleware.ts                 # Route protection (session cookie check)
├── docker-compose.yml
├── nginx.conf
└── README.md
```

---

## Author

<div align="center">

| Name |
|:---|
| Brian Ricardo Tamin |

</div>

---

<div align="center">
   <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=120&color=0:030712,100:0f172a&section=footer" />
</div>
