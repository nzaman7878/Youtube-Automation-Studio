import { Router } from 'express';
import healthRoutes from './health.routes.js';
import { config } from '../config.js';
import { BadRequestError, QuotaExceededError } from '../errors/app-error.js';
import { z } from 'zod';

const router = Router();

router.use('/health', healthRoutes);

// Test routes enabled exclusively in test environment for error middleware verification
if (config.NODE_ENV === 'test') {
  router.get('/test/app-error', (_req, _res, next) => {
    next(new BadRequestError('Invalid query parameters provided', { field: 'filter' }));
  });

  router.get('/test/quota-error', (_req, _res, next) => {
    next(new QuotaExceededError());
  });

  router.get('/test/unhandled-error', () => {
    throw new Error('Database connection unexpectedly dropped');
  });

  router.post('/test/zod-validation', (req, res, next) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        channelName: z.string().min(3),
      });
      const validated = schema.parse(req.body);
      res.json({ success: true, data: validated });
    } catch (err) {
      next(err);
    }
  });
}

export default router;
