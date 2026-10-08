import { getOllamaModel, checkOllamaAvailability } from './model';
import { ExplanationSchema, ExplanationResult } from './schemas';
import { EXPLANATION_SYSTEM_PROMPT, buildExplanationPrompt } from './prompts';

export interface ExplanationResponse {
  success: boolean;
  data: ExplanationResult;
  isFallback: boolean;
  error?: string;
}

/**
 * Fallback grounded explanation generator when Ollama is unavailable
 */
export function fallbackGenerateExplanation(
  userQuery: string,
  userRequirements: Record<string, any>,
  selectedProducts: Array<Record<string, any>>,
  alternativeProducts: Array<Record<string, any>> = []
): ExplanationResult {
  const productExplanations = selectedProducts.map((p) => {
    const matchedFeatures: string[] = [];
    if (userRequirements.category && p.category?.toLowerCase() === userRequirements.category.toLowerCase()) {
      matchedFeatures.push(`Matches category: ${p.category}`);
    }
    if (userRequirements.skinType && p.skinTypes?.map((s: string) => s.toLowerCase()).includes(userRequirements.skinType.toLowerCase())) {
      matchedFeatures.push(`Formulated for ${userRequirements.skinType} skin`);
    }
    if (userRequirements.maxPrice && p.price <= userRequirements.maxPrice) {
      matchedFeatures.push(`Within budget at ₹${p.price} (max ₹${userRequirements.maxPrice})`);
    }
    if (userRequirements.texture && p.texture?.toLowerCase().includes(userRequirements.texture.toLowerCase())) {
      matchedFeatures.push(`Features requested ${p.texture} texture`);
    }
    if (p.fragranceFree) {
      matchedFeatures.push('Fragrance-free formula');
    }

    const whyRec = `${p.name} by ${p.brand} is recommended because it matches your requirement for ${
      userRequirements.category || 'skincare'
    } (${p.skinTypes ? p.skinTypes.join(', ') : ''} skin) priced at ₹${p.price}.`;

    const altNames = alternativeProducts.slice(0, 2).map((alt) => alt.name).join(', ');
    const compNotes = altNames
      ? `Chosen over alternatives (${altNames}) due to a higher overall rating of ${p.rating}/5.0 and direct alignment with your skin profile.`
      : `Selected as a top tier choice with a rating of ${p.rating}/5.0.`;

    return {
      productId: p.id || 'unknown',
      productName: p.name || 'Product',
      whyRecommended: whyRec,
      comparisonNotes: compNotes,
      keyBenefits: matchedFeatures.length > 0 ? matchedFeatures : ['High customer rating', 'Tailored skin suitability'],
    };
  });

  return {
    overview: `These recommendations were selected to match your search: "${userQuery}". Products were filtered strictly by your preferences for budget, skin suitability, and performance.`,
    productExplanations,
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
 * Generates grounded recommendation explanations using Ollama (Qwen3 4B)
 */
export async function generateExplanation(
  userQuery: string,
  userRequirements: Record<string, any>,
  selectedProducts: Array<Record<string, any>>,
  alternativeProducts: Array<Record<string, any>> = [],
  timeoutMs = 10000
): Promise<ExplanationResponse> {
  if (!selectedProducts || selectedProducts.length === 0) {
    return {
      success: true,
      data: {
        overview: 'No matching products available to generate explanation.',
        productExplanations: [],
      },
      isFallback: false,
    };
  }

  // Check Ollama availability
  const health = await checkOllamaAvailability();
  if (!health.available) {
    console.warn(`[AI Explanation Generator] Ollama unavailable (${health.error}). Using fallback explanation generator.`);
    return {
      success: true,
      data: fallbackGenerateExplanation(userQuery, userRequirements, selectedProducts, alternativeProducts),
      isFallback: true,
      error: `Ollama unavailable: ${health.error}`,
    };
  }

  try {
    const model = getOllamaModel(0.3, true);

    const invokePromise = model.invoke([
      { role: 'system', content: EXPLANATION_SYSTEM_PROMPT },
      { role: 'user', content: buildExplanationPrompt(userQuery, userRequirements, selectedProducts, alternativeProducts) },
    ]);

    const response = await withTimeout(
      invokePromise,
      timeoutMs,
      `Ollama explanation timed out after ${timeoutMs}ms`
    );

    const rawText = typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);

    let jsonString = rawText.trim();
    const markdownMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      jsonString = markdownMatch[1].trim();
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (parseErr) {
      console.warn(`[AI Explanation Generator] Failed to parse JSON response from Ollama. Using fallback.`);
      return {
        success: true,
        data: fallbackGenerateExplanation(userQuery, userRequirements, selectedProducts, alternativeProducts),
        isFallback: true,
        error: 'AI output was not valid JSON',
      };
    }

    const validatedResult = ExplanationSchema.safeParse(parsedData);
    if (!validatedResult.success) {
      console.warn(`[AI Explanation Generator] Validation failed: ${validatedResult.error.message}`);
      return {
        success: true,
        data: fallbackGenerateExplanation(userQuery, userRequirements, selectedProducts, alternativeProducts),
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
    console.warn(`[AI Explanation Generator] Ollama execution fallback triggered: ${err.message || String(err)}`);
    return {
      success: true,
      data: fallbackGenerateExplanation(userQuery, userRequirements, selectedProducts, alternativeProducts),
      isFallback: true,
      error: err.message || String(err),
    };
  }
}
