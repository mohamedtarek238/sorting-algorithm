//error Handler
import { Response } from 'express';
import { logger } from '../services/systemService';
import { z } from 'zod';

export const handleError = (err: unknown, res: Response): void => {
  logger.error(err instanceof Error ? err.message : 'Unknown error');

  if (err instanceof z.ZodError) {
    res.status(400).json({ error: 'Invalid input', details: err.errors });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
};
