import prisma from '../utils/prisma';
import { Product } from '@prisma/client';

export interface ProductFilters {
  category?: string;
  skinType?: string;
  maxPrice?: number;
  minRating?: number;
  fragranceFree?: boolean;
  search?: string;
}

export class ProductService {
  /**
   * Get all products with optional filtering parameters
   */
  static async getAllProducts(filters: ProductFilters = {}): Promise<Product[]> {
    const whereClause: any = {};

    if (filters.category) {
      whereClause.category = {
        equals: filters.category,
        mode: 'insensitive',
      };
    }

    if (filters.skinType) {
      whereClause.skinTypes = {
        has: filters.skinType.toLowerCase(),
      };
    }

    if (filters.maxPrice) {
      whereClause.price = {
        lte: filters.maxPrice,
      };
    }

    if (filters.minRating) {
      whereClause.rating = {
        gte: filters.minRating,
      };
    }

    if (typeof filters.fragranceFree === 'boolean') {
      whereClause.fragranceFree = filters.fragranceFree;
    }

    if (filters.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { brand: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return await prisma.product.findMany({
      where: whereClause,
      orderBy: {
        rating: 'desc',
      },
    });
  }

  /**
   * Get a single product by ID
   */
  static async getProductById(id: string): Promise<Product | null> {
    if (!id || typeof id !== 'string') {
      return null;
    }
    return await prisma.product.findUnique({
      where: { id },
    });
  }
}
