import { Request, Response, NextFunction } from 'express';
import { ProductService, ProductFilters } from '../services/product.service';

export class ProductController {
  /**
   * GET /api/products
   * List all products with optional filters
   */
  static async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, skinType, maxPrice, minRating, fragranceFree, search } = req.query;

      const filters: ProductFilters = {};

      if (category && typeof category === 'string') {
        filters.category = category;
      }

      if (skinType && typeof skinType === 'string') {
        filters.skinType = skinType;
      }

      if (maxPrice && !isNaN(Number(maxPrice))) {
        filters.maxPrice = Number(maxPrice);
      }

      if (minRating && !isNaN(Number(minRating))) {
        filters.minRating = Number(minRating);
      }

      if (fragranceFree !== undefined) {
        filters.fragranceFree = fragranceFree === 'true';
      }

      if (search && typeof search === 'string') {
        filters.search = search;
      }

      const products = await ProductService.getAllProducts(filters);

      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/:id
   * Get single product detail by ID
   */
  static async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const product = await ProductService.getProductById(id);

      if (!product) {
        res.status(404).json({
          success: false,
          error: 'Product not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
}
