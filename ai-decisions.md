# AI Architectural Decisions and Rationale

This document details the architectural choices, tradeoffs, and design rationale behind the AI intelligence layer in BeautyPilot.

---

## 1. Why Local Ollama Execution?

BeautyPilot utilizes local Ollama execution (`http://localhost:11434`) for inference rather than relying on cloud-based LLM APIs (such as OpenAI or Anthropic).

### Key Rationale
- **Data Privacy & Confidentiality**: User queries and skin profile constraints remain strictly local on the client machine or self-hosted environment.
- **Zero Operating API Costs**: Running local quantized GGUF models eliminates per-token API billing and recurring usage fees.
- **Elimination of Third-Party Rate Limits**: Prevents rate-limit throttling during peak traffic or automated batch evaluations.
- **Offline Capability & Independence**: Allows full application functionality without requiring active external internet connectivity.

---

## 2. Why Qwen2.5 3B Model Selection?

The backend is configured to use `qwen2.5:3b` as its default local language model (`OLLAMA_MODEL="qwen2.5:3b"`).

### Key Rationale
- **Optimized for Structured JSON Output**: `qwen2.5:3b` demonstrates exceptional instruction-following accuracy for JSON schema extractions compared to smaller 1B/2B models.
- **Non-Thinking Model Architecture**: Unlike thinking models (such as `qwen3:4b`), `qwen2.5:3b` does not execute internal chain-of-thought loops (`<think>...</think>`), avoiding 40+ second CPU latency spikes per request.
- **Low Memory Footprint**: At 1.9 GB quantized size, `qwen2.5:3b` fits easily into system RAM/VRAM while maintaining high accuracy.

---

## 3. Why Native HTTP Fetch Client Over LangChain GGUF Grammar?

Initially, `@langchain/ollama` was evaluated for request handling. However, benchmarking revealed that LangChain's JSON schema grammar constraints forced token-by-token CPU grammar validation, resulting in 45-80 second timeouts.

### Key Rationale
- **5x Faster CPU Inference**: Direct HTTP `fetch` requests to Ollama's `/api/chat` endpoint bypass GGUF grammar bottlenecks, reducing inference time to 10-12 seconds on standard hardware.
- **Model Warmup & In-Memory Persistence**: Using `keep_alive: "60m"` in Ollama chat requests keeps model weights loaded in system RAM, preventing 15-second cold-start reload delays on user queries.
- **Token Generation Capping**: Passing `num_predict: 350` caps maximum token generation, ensuring prompt completion occurs rapidly without conversational bloat.

---

## 4. Why Deterministic Product Ranking Over Direct LLM Selection?

Allowing a language model to directly select products from a database leads to unpredictable results, invalid foreign keys, pricing hallucinations, and inconsistent rankings.

### Hybrid Architecture Strategy
1. **AI Engine Role**: Natural language processing is restricted to two tasks:
   - Extracting structured parameters (`category`, `skinType`, `maxPrice`, `texture`, `fragranceFree`, `concerns`) from natural user queries.
   - Generating grounded, human-understandable recommendation summaries for selected candidate products.
2. **Deterministic Software Engine Role**: Database retrieval and product scoring are executed strictly in code via Prisma SQL queries and a mathematical scoring algorithm:
   - `score = categoryMatch + skinTypeMatch + budgetMatch + textureMatch + fragranceFreeMatch + matchingConcerns + ratingScore`

---

## 5. How Hallucinations Are Prevented

BeautyPilot enforces three levels of architectural constraints to eliminate AI hallucinations:

1. **No Direct Database Access**: The LLM is never given database credentials, nor can it generate dynamic SQL/Prisma queries.
2. **Strict Grounded Prompt Context**: During explanation generation, the system prompt strictly provides a JSON array of the top candidate products fetched from the database. The LLM is constrained by system instructions to explain ONLY products present in that context.
3. **Resilient Fallback Execution**: If the LLM execution times out or produces malformed JSON, the backend automatically engages a deterministic fallback extractor and explanation engine, ensuring 100% application uptime.
