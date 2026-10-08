import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';

const router = Router();

router.get('/health', AIController.getHealth);
router.post('/extract', AIController.extract);
router.post('/explain', AIController.explain);

export default router;
