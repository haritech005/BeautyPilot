import { Request, Response } from 'express';
import { RecommendationService } from '../services/recommendation.service';

export class RecommendationController {
  /**
   * Main API endpoint: POST /api/recommendations
   */
  static async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body;

      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Field "query" is required and must be a non-empty string.',
        });
        return;
      }

      const result = await RecommendationService.getRecommendations(query);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error processing recommendation request.',
      });
    }
  }
}
