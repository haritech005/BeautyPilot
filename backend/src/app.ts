import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import aiRoutes from './routes/ai.routes';
import recommendationRoutes from './routes/recommendation.routes';
import { errorHandler } from './middleware/errorHandler.middleware';

const app: Express = express();

app.use(cors());
app.use(express.json());

// Product Catalog REST API Endpoints
app.use('/api/products', productRoutes);

// AI / LangChain Endpoints
app.use('/api/ai', aiRoutes);

// Recommendation Engine Endpoints
app.use('/api/recommendations', recommendationRoutes);

// 404 Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.url}`,
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
