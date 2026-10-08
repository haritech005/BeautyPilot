import { z } from 'zod';

/**
 * Zod Schema for structured requirement extraction from user natural language query
 */
export const RequirementExtractionSchema = z.object({
  category: z.string().nullable().optional().describe('Product category (e.g. moisturizer, cleanser, serum, sunscreen, toner, exfoliator, mask)'),
  skinType: z.string().nullable().optional().describe('Skin type (e.g. oily, dry, combination, sensitive, normal)'),
  maxPrice: z.number().nullable().optional().describe('Maximum budget or price threshold in numerical value (e.g. 1000)'),
  minRating: z.number().nullable().optional().describe('Minimum product rating filter (e.g. 4.0)'),
  texture: z.string().nullable().optional().describe('Desired product texture (e.g. lightweight, gel, cream, lotion)'),
  fragranceFree: z.boolean().nullable().optional().describe('Whether the user explicitly requested fragrance-free product'),
  concerns: z.array(z.string()).optional().default([]).describe('List of specific skin concerns mentioned (e.g. acne, aging, redness, dryness)'),
  search: z.string().nullable().optional().describe('Key brand names, ingredients, or search keywords'),
  summary: z.string().optional().default('').describe('Brief AI summary of the user intent'),
});

export type RequirementExtractionResult = z.infer<typeof RequirementExtractionSchema>;

/**
 * Schema for grounded product comparison and recommendation explanations
 */
export const ProductExplanationItemSchema = z.object({
  productId: z.string().describe('ID of the product'),
  productName: z.string().describe('Name of the product'),
  whyRecommended: z.string().describe('Explanation of why this product fits the user profile and query'),
  comparisonNotes: z.string().describe('Explanation comparing why this product was selected over alternative options'),
  keyBenefits: z.array(z.string()).describe('Key matching features/ingredients for the user requirements'),
});

export const ExplanationSchema = z.object({
  overview: z.string().describe('General overview summarizing why these recommendations suit the query'),
  productExplanations: z.array(ProductExplanationItemSchema).describe('Detailed grounded explanations for each top product'),
});

export type ProductExplanationItem = z.infer<typeof ProductExplanationItemSchema>;
export type ExplanationResult = z.infer<typeof ExplanationSchema>;
