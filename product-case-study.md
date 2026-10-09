# Product Case Study: BeautyPilot

This case study details the product discovery problem, target user persona, solution architecture, product interaction flow, and engineering decisions behind BeautyPilot.

---

## 1. Problem Statement

Consumer skincare purchasing online is currently flawed and overwhelming:
- **Confusing Terminology & Claims**: Shoppers encounter complex scientific ingredient lists (e.g. Squalane, Niacinamide, Hyaluronic Acid) without understanding how they interact with their skin profile.
- **Rigid E-Commerce Filtering**: Traditional filter dropdowns force users to select singular attributes (e.g. "Moisturizer") but fail to accommodate multi-constraint natural language requirements like *"I have oily skin, need a lightweight gel texture, and have a max budget of ₹1,000"*.
- **Lack of Transparency**: E-commerce recommendation engines frequently promote sponsored listings rather than products objectively suited to the user's specific skin needs.

---

## 2. Target User Persona

- **Persona**: The Conscious Skincare Shopper
- **Characteristics**:
  - Knows their skin type (e.g. oily, sensitive, dry, combination) or specific concerns (e.g. acne, redness, barrier repair).
  - Works within specific budget limits.
  - Wants clear, transparent reasons why a product is recommended rather than generic marketing slogans.
  - Prefers side-by-side comparison of active ingredients, pricing, and textures before committing to a purchase.

---

## 3. Solution Overview

BeautyPilot addresses these challenges by introducing an AI-powered natural language search console backed by a deterministic formulation matching engine.

### Key Solution Highlights
- **Conversational Search Console**: Users type their skin requirements in everyday natural phrasing.
- **Instant Requirement Extraction**: Local AI extracts key parameters (`skinType`, `category`, `maxPrice`, `texture`, `concerns`) in real time.
- **Transparent Formulations Matching**: SQL database catalogs are filtered and scored deterministically based on formula suitability.
- **Grounded AI Explanations**: Concise, objective summaries explain why each product was selected over alternative candidates.
- **Side-by-Side Comparison Matrix**: Interactive drawer modals allow users to compare up to 3 products across pricing, active ingredients, rating, and texture.

---

## 4. Product User Flow

```text
1. Homepage Search Console
   └─ User enters: "I have oily skin and need a gel moisturizer under ₹1,000"

2. Search Submission & State Transition
   └─ Homepage hero smoothly transitions into compact search bar view
   └─ Animated 3-step progress indicator displays consultation processing

3. Recommendation Results Display
   └─ Renders candidate product cards ranked by formula match
   └─ Badges highlight "Best overall", "Best lightweight", and "Best budget"

4. Product Detail & Formula Drawer
   └─ User clicks "View details" to inspect active ingredients, size, and AI matching notes

5. Side-by-Side Formula Comparison
   └─ User selects up to 3 products to launch interactive comparison matrix
```

---

## 5. Engineering Decisions and Trade-offs

### 1. Hybrid AI + Deterministic Ranking
- **Decision**: Used local LLM (`qwen2.5:3b`) for text parsing and explanation generation, while keeping candidate search and scoring strictly deterministic in Prisma SQL math.
- **Trade-off**: Requires structured JSON prompt engineering and fallback handling, but guarantees zero database hallucinations or invalid candidate rankings.

### 2. Client-Side Comparison State
- **Decision**: Managed product selection and side-by-side comparison entirely in React component state.
- **Trade-off**: Requires passing product catalog data cleanly in initial API payloads, but provides instantaneous (0ms latency) comparison interactions without server roundtrips.

### 3. Luxury Beauty Tech Aesthetics
- **Decision**: Designed a warm ivory visual identity (`#faf8f5`) with deep plum typography (`#1f0b2b`) and subtle purple/rose ambient glows.
- **Trade-off**: Avoided standard dark modes or generic SaaS dashboard templates to deliver a modern, high-end Beauty Tech user experience aligned with luxury skincare brands.
