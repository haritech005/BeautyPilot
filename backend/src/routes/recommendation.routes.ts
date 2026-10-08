import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller';

const router = Router();

router.post('/', RecommendationController.getRecommendations);

export default router;
