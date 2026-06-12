import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { generalLimiter } from './middlewares/rateLimit.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';
import { setupSwagger } from './config/swagger';
import authRoutes from './modules/auth/auth.routes';
import postRoutes from './modules/posts/post.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(generalLimiter);

setupSwagger(app);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Personal Blogging Platform API',
    data: {
      version: '1.0.0',
      docs: '/api-docs',
    },
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Service is healthy',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
