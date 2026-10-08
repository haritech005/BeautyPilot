import { Product } from '@prisma/client';
import { ProductService } from './product.service';
import { extractRequirements } from '../ai/requirement-extractor';
import { generateExplanation } from '../ai/explanation-generator';
import { RequirementExtractionResult } from '../ai/schemas';

export interface ProductMatchBreakdown {
  categoryMatch: boolean;
  skinTypeMatch: boolean;
  budgetMatch: boolean;
  textureMatch: boolean;
  fragranceFreeMatch: boolean;
  matchingConcerns: string[];
  ratingScore: number;
}

export interface RankedProduct {
  product: Product;
  score: number;
  matchBreakdown: ProductMatchBreakdown;
  explanation?: {
    whyRecommended: string;
    comparisonNotes: string;
    keyBenefits: string[];
  };
}

export interface RecommendationResult {
  success: boolean;
  query: string;
  requirements: RequirementExtractionResult;
  recommendations: RankedProduct[];
  overview: string;
  totalCandidatesFound: number;
  isAiFallback: boolean;
  message?: string;
}

export class RecommendationService {
  /**
   * Calculate deterministic match score for a product against user requirements
   */
  static scoreProduct(product: Product, reqs: RequirementExtractionResult): { score: number; breakdown: ProductMatchBreakdown } {
    let score = 0;

    // Category match (+25)
    const categoryMatch = Boolean(
      reqs.category && product.category.toLowerCase() === reqs.category.toLowerCase()
    );
    if (categoryMatch) score += 25;

    // Skin type match (+30)
    const skinTypeMatch = Boolean(
      reqs.skinType &&
      product.skinTypes.map((s) => s.toLowerCase()).includes(reqs.skinType.toLowerCase())
    );
    if (skinTypeMatch) score += 30;

    // Budget match (+20)
    const budgetMatch = Boolean(
      reqs.maxPrice && product.price <= reqs.maxPrice
    );
    if (budgetMatch) score += 20;

    // Texture match (+10)
    const textureMatch = Boolean(
      reqs.texture && product.texture.toLowerCase().includes(reqs.texture.toLowerCase())
    );
    if (textureMatch) score += 10;

    // Fragrance free match (+10)
    const fragranceFreeMatch = Boolean(
      typeof reqs.fragranceFree === 'boolean' && product.fragranceFree === reqs.fragranceFree
    );
    if (fragranceFreeMatch) score += 10;

    // Concerns match (+5 per concern)
    const matchingConcerns: string[] = [];
    if (reqs.concerns && reqs.concerns.length > 0) {
      for (const concern of reqs.concerns) {
        const cLower = concern.toLowerCase();
        const matchesConcern = product.concerns.some((c) => c.toLowerCase().includes(cLower));
        const matchesIngredient = product.ingredients.some((i) => i.toLowerCase().includes(cLower));
        if (matchesConcern || matchesIngredient) {
          matchingConcerns.push(concern);
          score += 5;
        }
      }
    }

    // Rating score (up to +5 based on rating / 5.0 * 5)
    const ratingScore = Number(((product.rating / 5.0) * 5).toFixed(1));
    score += ratingScore;

    return {
      score: Math.round(score),
      breakdown: {
        categoryMatch,
        skinTypeMatch,
        budgetMatch,
        textureMatch,
        fragranceFreeMatch,
        matchingConcerns,
        ratingScore,
      },
    };
  }

  /**
   * Main recommendation pipeline orchestrating:
   * Extraction -> Retrieval -> Filtering -> Ranking -> Top 3 -> Grounded AI Explanation
   */
  static async getRecommendations(userQuery: string): Promise<RecommendationResult> {
    if (!userQuery || typeof userQuery !== 'string' || userQuery.trim().length === 0) {
      throw new Error('User query is required for recommendation processing.');
    }

    const cleanQuery = userQuery.trim();

    // 1. Requirement Extraction
    const extractionResponse = await extractRequirements(cleanQuery);
    const requirements = extractionResponse.data;

    // 2. Product Retrieval & Strict Filtering from DB
    let candidateProducts = await ProductService.getAllProducts({
      category: requirements.category || undefined,
      skinType: requirements.skinType || undefined,
      maxPrice: requirements.maxPrice || undefined,
      fragranceFree: typeof requirements.fragranceFree === 'boolean' ? requirements.fragranceFree : undefined,
    });

    // Handle relaxation if strict filters return 0 candidates
    if (candidateProducts.length === 0) {
      // Try relaxing category/skinType to return closest catalog options
      candidateProducts = await ProductService.getAllProducts({
        category: requirements.category || undefined,
      });
    }

    // If database still returns 0 products (e.g., empty database or no matching category)
    if (candidateProducts.length === 0) {
      return {
        success: true,
        query: cleanQuery,
        requirements,
        recommendations: [],
        overview: 'No matching products found in the catalog for your specified criteria. Try relaxing your budget or category filters.',
        totalCandidatesFound: 0,
        isAiFallback: extractionResponse.isFallback,
        message: 'No candidates matched the request.',
      };
    }

    // 3. Ranking & Scoring
    const rankedCandidates: RankedProduct[] = candidateProducts.map((product) => {
      const { score, breakdown } = this.scoreProduct(product, requirements);
      return {
        product,
        score,
        matchBreakdown: breakdown,
      };
    });

    // Sort descending by score, then by rating
    rankedCandidates.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.product.rating - a.product.rating;
    });

    // 4. Select Top 3 Products & Alternative Candidates
    const topRanked = rankedCandidates.slice(0, 3);
    const alternativeCandidates = rankedCandidates.slice(3, 6);

    const topProductData = topRanked.map((item) => item.product);
    const altProductData = alternativeCandidates.map((item) => item.product);

    // 5. Grounded AI Explanation Generation
    const explanationResponse = await generateExplanation(
      cleanQuery,
      requirements,
      topProductData,
      altProductData
    );

    // Map AI explanations onto the ranked products
    const explanationsMap = new Map<string, any>();
    if (explanationResponse.data && explanationResponse.data.productExplanations) {
      for (const item of explanationResponse.data.productExplanations) {
        explanationsMap.set(item.productId, item);
      }
    }

    const finalRecommendations: RankedProduct[] = topRanked.map((item) => {
      const aiExp = explanationsMap.get(item.product.id);
      return {
        ...item,
        explanation: aiExp
          ? {
              whyRecommended: aiExp.whyRecommended,
              comparisonNotes: aiExp.comparisonNotes,
              keyBenefits: aiExp.keyBenefits,
            }
          : {
              whyRecommended: `${item.product.name} matches your request with a rating of ${item.product.rating}/5.0.`,
              comparisonNotes: 'Selected based on high rating and feature match.',
              keyBenefits: item.product.skinTypes.map((st) => `For ${st} skin`),
            },
      };
    });

    return {
      success: true,
      query: cleanQuery,
      requirements,
      recommendations: finalRecommendations,
      overview: explanationResponse.data?.overview || `Top ${finalRecommendations.length} recommendations matched for your search.`,
      totalCandidatesFound: candidateProducts.length,
      isAiFallback: extractionResponse.isFallback || explanationResponse.isFallback,
    };
  }
}
