# BeautyPilot Frontend

Next.js Application for BeautyPilot AI Skincare Discovery Platform

## Overview
The BeautyPilot frontend is built using Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS. It provides a luxury Beauty Tech interface for natural language search, candidate product cards, detailed formula drawers, and side-by-side product comparisons.

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- React 19 & TypeScript
- Tailwind CSS
- Lucide React Icons

## Component Structure
```text
src/
├── app/
│   ├── page.tsx               # Primary search console & results container page
│   ├── layout.tsx             # Root layout with warm ivory background & typography
│   └── globals.css            # Ambient silk glows & design system tokens
├── components/
│   ├── Header.tsx             # Brand header navigation bar
│   ├── SearchInput.tsx        # Natural language query input console
│   ├── LoadingSteps.tsx       # Animated 3-step consultation loading indicator
│   ├── ProductCard.tsx        # Product recommendation cards
│   ├── ProductDetailModal.tsx # Detailed formula drawer / modal
│   ├── ComparisonModal.tsx    # Side-by-side product comparison modal
│   ├── RecommendationResults.tsx # Results container & comparison state coordinator
│   └── Footer.tsx             # Page footer
├── lib/
│   └── api.ts                 # Typed API client for POST /api/recommendations
└── types/
    └── recommendation.ts      # TypeScript interfaces for API contracts & Prisma models
```

## Setup and Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` in the `frontend` root:
```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Production Build Verification
```bash
npm run build
```
