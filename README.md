# BeautyPilot

AI-Powered Skincare Discovery and Intelligent Recommendation Engine

## Overview
BeautyPilot is a high-end Beauty Tech platform designed to eliminate skincare purchasing guesswork. By combining natural language processing with formulation matching science, BeautyPilot allows users to describe their skin profile, budget constraints, texture preferences, and concerns in everyday words (e.g. *"I have oily skin and need a lightweight moisturizer under ₹1,000"*).

Unlike legacy search tools that rely on rigid keyword filters, BeautyPilot uses local AI intelligence to extract structured requirements, queries a PostgreSQL database of formulation catalogs, scores matches deterministically, and presents grounded recommendation reasoning side-by-side with interactive product comparison.

---

## Documentation Index
- **[Main System Guide](README.md)**: Main setup and project structure guide (this document).
- **[AI Decisions & Rationale](ai-decisions.md)**: Deep dive into local Ollama model selection, native fetch client optimizations, hybrid ranking math, and hallucination prevention.
- **[Product Case Study](product-case-study.md)**: Problem statement, target user persona, solution architecture, user interaction flow, and design trade-offs.
- **[Frontend Guide](frontend/README.md)**: Next.js 16 component structure and UI guide.
- **[Backend Guide](backend/README.md)**: Express API route specifications and database guide.
---

## Product Demonstration Video
Watch the full end-to-end application walkthrough, natural language search, preference extraction, formulation candidate matching, and side-by-side product comparison:

- **Video Walkthrough**: [BeautyPilot Product Demonstration Video (Google Drive)](https://drive.google.com/file/d/1AsQtJJ3at1ylxp1Cn2E8G-BaUcNlFF1q/view?usp=sharing)

---

## Application Visual Showcase

### 1. Natural Language Search Console
![Natural Language Search Console](docs/screenshots/Screenshot%202026-10-09%20191801.png)

### 2. AI Consultation Engine Loading State
![AI Consultation Engine Loading State](docs/screenshots/Screenshot%202026-10-09%20191821.png)

### 3. Personalized Recommendations Grid
![Personalized Recommendations Grid](docs/screenshots/Screenshot%202026-10-09%20191906.png)

### 4. Formula Specifications & Product Details
![Formula Specifications & Product Details](docs/screenshots/Screenshot%202026-10-09%20191924.png)

### 5. Side-by-Side Product Comparison Matrix
![Side-by-Side Product Comparison](docs/screenshots/Screenshot%202026-10-09%20191937.png)

---

## Key Features
- **Natural Language Search Console**: Accepts natural conversational input to parse category, skin type, max budget, texture, fragrance preference, and specific skin concerns.
- **Deterministic Product Ranking Engine**: Ranks product candidates against extracted constraints using a transparent scoring algorithm.
- **Grounded AI Explanations**: Generates concise, hallucination-free explanations highlighting why each recommended product fits the user's specific skin profile.
- **Product Detail Drawer**: Displays catalog specifications, active ingredient profiles, and skin compatibility details.
- **Side-by-Side Product Comparison**: Allows users to select up to 3 products to compare prices, ratings, textures, fragrance-free status, ingredients, and AI reasoning side-by-side.
- **Resilient AI Execution & Fallback**: Native local Ollama integration (`qwen2.5:3b`) with deterministic rule-based fallback to guarantee 100% service uptime even if LLM services are offline.

---

## System Architecture & Data Flow

### Request Execution Flow
```text
[ User Query ]
      ↓
[ Next.js Frontend ]
      ↓ HTTP POST /api/recommendations
[ Express REST API ]
      ↓
[ Ollama AI Engine (qwen2.5:3b) ] ──(Structured Requirement Extraction)
      ↓
[ Prisma ORM ]
      ↓ SQL Query
[ PostgreSQL Database ]
      ↓ (Candidate Products)
[ Deterministic Ranking Algorithm ] ──(Candidate Scoring & Top Selection)
      ↓
[ Ollama AI Engine (qwen2.5:3b) ] ──(Grounded Explanation Generation)
      ↓
[ Next.js Frontend Results View ]
```

### Component Structure
```text
BeautyPilot/
├── frontend/                     # Next.js 16 App Router Application
│   ├── src/app/                  # Main Search & Header Container Pages
│   ├── src/components/           # Reusable UI Components (ProductCard, Modals, SearchInput)
│   ├── src/lib/api.ts            # Typed Backend API Client
│   └── src/types/                # TypeScript Interface Contracts
├── backend/                      # Express REST API Backend
│   ├── src/ai/                   # Ollama Client, Prompts, Requirement Extractor, Explanation Engine
│   ├── src/services/             # Scoring & Candidate Search Business Logic
│   ├── src/controllers/          # Recommendation Endpoint Route Handlers
│   ├── src/routes/               # Express Router Definitions
│   └── prisma/                   # Prisma Schema & Database Seed Scripts
├── ai-decisions.md               # AI Architecture & Model Decisions
├── product-case-study.md         # Product Design Case Study
└── README.md                     # Main Project Overview Guide
```

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Node.js (v22), Express.js, TypeScript, tsx watch
- **Database & ORM**: PostgreSQL 17, Prisma ORM (v6)
- **AI Engine**: Ollama (`qwen2.5:3b`), Native AbortController Fetch Client

---

## Environment Variables

### Backend Configuration (`backend/.env`)
```env
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5433/beautypilot"
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="qwen2.5:3b"
```

### Frontend Configuration (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"
```

---

## Setup and Installation Instructions

### Prerequisites
- Node.js (v18+ or v22+)
- PostgreSQL 17 (Running on port 5432 or 5433)
- Ollama Local Service (`http://localhost:11434`)

### Step 1: Clone Repository
```bash
git clone https://github.com/haritech005/BeautyPilot.git
cd BeautyPilot
```

### Step 2: Backend Database Setup
```bash
cd backend
npm install

# Push Prisma Schema to PostgreSQL
npx prisma db push

# Seed Initial Skincare Catalog Database
npx prisma db seed
```

### Step 3: Local Ollama Model Setup
Ensure Ollama is running on your machine, then pull the lightweight `qwen2.5:3b` model:
```bash
ollama pull qwen2.5:3b
```

### Step 4: Run Backend Server
```bash
cd backend
npm run dev
```
The backend server runs on `http://localhost:5000`.

### Step 5: Run Frontend Application
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Example Queries

Try the following natural language queries in the search console:
- `"I have oily skin and need a lightweight moisturizer under ₹1,000"`
- `"Gentle fragrance-free cleanser for sensitive skin"`
- `"Hydrating gel moisturizer for acne-prone skin"`
- `"Sunscreen for oily skin under ₹1,500"`
