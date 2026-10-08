import { Request, Response, NextFunction } from 'express';
import { RecommendationService } from '../services/recommendation.service';

export class RecommendationController {
  /**
   * Main API endpoint: POST /api/recommendations
   */
  static async getRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query } = req.body;

      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Field "query" is required and must be a non-empty string.',
        });
        return;
      }

      // Sanitize excessively long input (limit to max 1000 characters)
      const sanitizedQuery = query.trim().slice(0, 1000);

      const result = await RecommendationService.getRecommendations(sanitizedQuery);
      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }
}
