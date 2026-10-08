# BeautyPilot

AI-powered beauty product discovery and recommendation platform.

## Overview

BeautyPilot enables users to discover skincare and beauty products through natural language queries (e.g. *"I have oily skin and need a lightweight moisturizer under ₹1,000"*).

## System Architecture

BeautyPilot follows a strict separation of concerns:
- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript, Prisma ORM, PostgreSQL 17
- **AI Integration**: LangChain.js + Ollama (`qwen3:4b`) for structured intent extraction and grounded explanations

## Project Structure

```text
BeautyPilot/
├── frontend/          # Next.js Application
├── backend/           # Express REST API
├── PRD.md             # Product Requirements Document
├── architecture.md    # Development Architecture & Implementation Plan
└── README.md          # Project Overview & Setup Guide
```

## Getting Started

Refer to `backend/README.md` and `frontend/README.md` for setup instructions.
