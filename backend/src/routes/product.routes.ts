import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();

// Product endpoints
router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);

export default router;
