import { getOllamaModel, checkOllamaAvailability } from './model';
import { RequirementExtractionSchema, RequirementExtractionResult } from './schemas';
import { EXTRACTION_SYSTEM_PROMPT, buildExtractionPrompt } from './prompts';

export interface ExtractionResponse {
  success: boolean;
  data: RequirementExtractionResult;
  isFallback: boolean;
  error?: string;
}

/**
 * Deterministic fallback extractor for when Ollama is unavailable or returns unparseable output
 */
export function fallbackExtractRequirements(query: string): RequirementExtractionResult {
  const lowerQuery = query.toLowerCase();

  // Category matching
  let category: string | null = null;
  const categories = ['moisturizer', 'cleanser', 'serum', 'sunscreen', 'toner', 'exfoliator', 'mask', 'eye cream'];
  for (const cat of categories) {
    if (lowerQuery.includes(cat)) {
      category = cat;
      break;
    }
  }

  // Skin type matching
  let skinType: string | null = null;
  const skinTypes = ['oily', 'dry', 'combination', 'sensitive', 'normal'];
  for (const st of skinTypes) {
    if (lowerQuery.includes(st)) {
      skinType = st;
      break;
    }
  }

  // Budget / max price extraction (e.g. under ₹1000, under 1000, max 1000, 1000 rs, <=1000)
  let maxPrice: number | null = null;
  const priceMatch = lowerQuery.match(/(?:under|below|less than|max|budget|rs\.?|₹|\$)\s*(\d+)/i) ||
                     lowerQuery.match(/(\d+)\s*(?:rs|rupees|inr)/i);
  if (priceMatch && priceMatch[1]) {
    const parsed = parseInt(priceMatch[1], 10);
    if (!isNaN(parsed) && parsed > 0) {
      maxPrice = parsed;
    }
  }

  // Texture matching
  let texture: string | null = null;
  const textures = ['lightweight', 'gel', 'cream', 'lotion', 'watery', 'rich'];
  for (const tex of textures) {
    if (lowerQuery.includes(tex)) {
      texture = tex;
      break;
    }
  }

  // Fragrance-free
  let fragranceFree: boolean | null = null;
  if (lowerQuery.includes('fragrance free') || lowerQuery.includes('fragrance-free') || lowerQuery.includes('unscented')) {
    fragranceFree = true;
  }

  // Concerns
  const concerns: string[] = [];
  if (lowerQuery.includes('acne') || lowerQuery.includes('pimple') || lowerQuery.includes('breakout')) concerns.push('acne');
  if (lowerQuery.includes('aging') || lowerQuery.includes('wrinkle') || lowerQuery.includes('fine lines')) concerns.push('aging');
  if (lowerQuery.includes('redness') || lowerQuery.includes('irritat')) concerns.push('redness');
  if (lowerQuery.includes('dryness') || lowerQuery.includes('dehydrat')) concerns.push('dryness');

  return {
    category,
    skinType,
    maxPrice,
    minRating: null,
    texture,
    fragranceFree,
    concerns,
    search: null,
    summary: `Fallback extracted requirements for: "${query}"`,
  };
}

/**
 * Promise wrapper with configurable timeout
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Extracts structured requirements using Ollama (Qwen3 4B) with fallback error handling
 */
export async function extractRequirements(query: string, timeoutMs = 8000): Promise<ExtractionResponse> {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return {
      success: false,
      data: fallbackExtractRequirements(''),
      isFallback: true,
      error: 'User query cannot be empty',
    };
  }

  const cleanQuery = query.trim();

  // Check Ollama availability first
  const health = await checkOllamaAvailability();
  if (!health.available) {
    console.warn(`[AI Requirement Extractor] Ollama unavailable (${health.error}). Using fallback extractor.`);
    return {
      success: true,
      data: fallbackExtractRequirements(cleanQuery),
      isFallback: true,
      error: `Ollama unavailable: ${health.error}`,
    };
  }

  try {
    const model = getOllamaModel(0.1, true);

    const invokePromise = model.invoke([
      { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
      { role: 'user', content: buildExtractionPrompt(cleanQuery) },
    ]);

    const response = await withTimeout(
      invokePromise,
      timeoutMs,
      `Ollama extraction timed out after ${timeoutMs}ms`
    );

    const rawText = typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);

    // Extract JSON string
    let jsonString = rawText.trim();
    const markdownMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      jsonString = markdownMatch[1].trim();
    }

    // Parse JSON
    let parsedData: any;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (parseErr) {
      console.warn(`[AI Requirement Extractor] Failed to parse JSON response from Ollama. Raw output:\n${rawText}`);
      return {
        success: true,
        data: fallbackExtractRequirements(cleanQuery),
        isFallback: true,
        error: 'AI output was not valid JSON',
      };
    }

    // Validate using Zod schema
    const validatedResult = RequirementExtractionSchema.safeParse(parsedData);
    if (!validatedResult.success) {
      console.warn(`[AI Requirement Extractor] Validation failed for AI output: ${validatedResult.error.message}`);
      return {
        success: true,
        data: fallbackExtractRequirements(cleanQuery),
        isFallback: true,
        error: `AI output failed schema validation: ${validatedResult.error.message}`,
      };
    }

    return {
      success: true,
      data: validatedResult.data,
      isFallback: false,
    };
  } catch (err: any) {
    console.warn(`[AI Requirement Extractor] Ollama execution fallback triggered: ${err.message || String(err)}`);
    return {
      success: true,
      data: fallbackExtractRequirements(cleanQuery),
      isFallback: true,
      error: err.message || String(err),
    };
  }
}
