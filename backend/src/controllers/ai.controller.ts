import { Request, Response } from 'express';
import { extractRequirements } from '../ai/requirement-extractor';
import { generateExplanation } from '../ai/explanation-generator';
import { checkOllamaAvailability } from '../ai/model';

export class AIController {
  /**
   * Health check for Ollama and Qwen3 model connection
   */
  static async getHealth(req: Request, res: Response): Promise<void> {
    const health = await checkOllamaAvailability();
    res.status(health.available ? 200 : 503).json({
      success: health.available,
      ollama: health,
    });
  }

  /**
   * Extract structured requirements from user natural language query
   */
  static async extract(req: Request, res: Response): Promise<void> {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Field "query" is required and must be a string.',
      });
      return;
    }

    const result = await extractRequirements(query);
    res.status(200).json(result);
  }

  /**
   * Generate grounded product recommendation explanations comparing selected vs alternatives
   */
  static async explain(req: Request, res: Response): Promise<void> {
    const { query, requirements, selectedProducts, alternativeProducts } = req.body;

    if (!selectedProducts || !Array.isArray(selectedProducts)) {
      res.status(400).json({
        success: false,
        error: 'Field "selectedProducts" is required and must be an array.',
      });
      return;
    }

    const result = await generateExplanation(
      query || '',
      requirements || {},
      selectedProducts,
      alternativeProducts || []
    );

    res.status(200).json(result);
  }
}
