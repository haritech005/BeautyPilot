export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  size: string;
  skinTypes: string[];
  concerns: string[];
  ingredients: string[];
  texture: string;
  fragranceFree: boolean;
  rating: number;
  description: string;
  imageUrl: string;
}

export interface ProductMatchBreakdown {
  categoryMatch: boolean;
  skinTypeMatch: boolean;
  budgetMatch: boolean;
  textureMatch: boolean;
  fragranceFreeMatch: boolean;
  matchingConcerns: string[];
  ratingScore: number;
}

export interface ProductExplanation {
  whyRecommended: string;
  comparisonNotes: string;
  keyBenefits: string[];
}

export interface RankedProduct {
  product: Product;
  score: number;
  matchBreakdown: ProductMatchBreakdown;
  explanation?: ProductExplanation;
}

export interface ExtractedRequirements {
  category?: string | null;
  skinType?: string | null;
  maxPrice?: number | null;
  minRating?: number | null;
  texture?: string | null;
  fragranceFree?: boolean | null;
  concerns?: string[];
  search?: string | null;
  summary?: string;
}

export interface RecommendationApiResponse {
  success: boolean;
  query: string;
  requirements: ExtractedRequirements;
  recommendations: RankedProduct[];
  overview: string;
  totalCandidatesFound: number;
  isAiFallback: boolean;
  message?: string;
  error?: string;
}
