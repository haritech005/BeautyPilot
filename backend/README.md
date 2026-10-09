# BeautyPilot Backend

Express REST API & Local AI Recommendation Engine for BeautyPilot

## Overview
The BeautyPilot backend is built using Node.js, Express.js, TypeScript, Prisma ORM, and PostgreSQL 17. It integrates with a local Ollama instance (`qwen2.5:3b`) for structured natural language requirement extraction and grounded recommendation explanation generation.

## Tech Stack
- Node.js (v22) & Express.js
- TypeScript & tsx watch
- Prisma ORM & PostgreSQL 17
- Ollama Native Fetch AI Integration (`qwen2.5:3b`)

## Directory Structure
```text
src/
├── ai/
│   ├── model.ts                 # Native fetch Ollama client & model warmup
│   ├── prompts.ts               # Extraction & explanation system prompts
│   ├── requirement-extractor.ts # Structured requirement extractor with fallback
│   ├── explanation-generator.ts # Grounded AI explanation generator with fallback
│   └── schemas.ts               # Zod validation schemas
├── controllers/
│   ├── recommendation.controller.ts # Recommendation request pipeline
│   ├── product.controller.ts        # Product CRUD endpoints
│   └── health.controller.ts         # Service health check
├── services/
│   ├── candidate-search.service.ts  # Database candidate SQL query filters
│   └── ranking.service.ts           # Deterministic product scoring algorithm
├── routes/
│   └── index.ts                 # API route definitions
├── app.ts                       # Express application config & CORS middleware
└── server.ts                    # Server startup & Ollama model warmup
```

## API Endpoints

### 1. Recommendation Endpoint
- **URL**: `POST /api/recommendations`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "query": "I have oily skin and need a gel moisturizer under 1000"
}
```
- **Response**:
```json
{
  "success": true,
  "query": "I have oily skin and need a gel moisturizer under 1000",
  "requirements": {
    "category": "moisturizer",
    "skinType": "oily",
    "maxPrice": 1000,
    "texture": "gel"
  },
  "recommendations": [...],
  "overview": "Selected based on hydration and oil control suitability.",
  "totalCandidatesFound": 8,
  "isAiFallback": false
}
```

### 2. Health Endpoint
- **URL**: `GET /api/health`
- **Response**: `{"status": "ok", "service": "BeautyPilot Backend"}`

## Setup and Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env` in the `backend` root:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5433/beautypilot"
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="qwen2.5:3b"
```

### 3. Database Migration & Seeding
```bash
npx prisma db push
npx prisma db seed
```

### 4. Start Local Ollama Model
```bash
ollama pull qwen2.5:3b
```

### 5. Start Backend Dev Server
```bash
npm run dev
```
