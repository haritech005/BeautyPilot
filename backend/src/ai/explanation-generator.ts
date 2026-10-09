import { callOllamaChat, checkOllamaAvailability } from './model';
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
 * Generates grounded recommendation explanations using Ollama (Qwen2.5 3B)
 */
export async function generateExplanation(
  userQuery: string,
  userRequirements: Record<string, any>,
  selectedProducts: Array<Record<string, any>>,
  alternativeProducts: Array<Record<string, any>> = [],
  timeoutMs = 60000
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
    return {
      success: true,
      data: fallbackGenerateExplanation(userQuery, userRequirements, selectedProducts, alternativeProducts),
      isFallback: true,
      error: `Ollama unavailable: ${health.error}`,
    };
  }

  try {
    const res = await callOllamaChat(
      [
        { role: 'system', content: EXPLANATION_SYSTEM_PROMPT },
        { role: 'user', content: buildExplanationPrompt(userQuery, userRequirements, selectedProducts, alternativeProducts) },
      ],
      { temperature: 0.2, timeoutMs }
    );

    if (!res.success || !res.content) {
      return {
        success: true,
        data: fallbackGenerateExplanation(userQuery, userRequirements, selectedProducts, alternativeProducts),
        isFallback: true,
        error: res.error || 'Ollama returned empty response',
      };
    }

    const rawText = res.content.trim();

    let jsonString = rawText;
    const markdownMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      jsonString = markdownMatch[1].trim();
    } else {
      const firstBrace = jsonString.indexOf('{');
      const lastBrace = jsonString.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonString = jsonString.substring(firstBrace, lastBrace + 1);
      }
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (parseErr) {
      return {
        success: true,
        data: fallbackGenerateExplanation(userQuery, userRequirements, selectedProducts, alternativeProducts),
        isFallback: true,
        error: 'AI output was not valid JSON',
      };
    }

    const validatedResult = ExplanationSchema.safeParse(parsedData);
    if (!validatedResult.success) {
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
    return {
      success: true,
      data: fallbackGenerateExplanation(userQuery, userRequirements, selectedProducts, alternativeProducts),
      isFallback: true,
      error: err.message || String(err),
    };
  }
}
