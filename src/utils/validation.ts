//validation  req data 
import { z } from 'zod';

export const SortSchema = z.object({
  data: z.array(z.number()).max(1000000),
  algorithm: z.enum([
    'quick',
    'merge',
    'radix',
    'tim',
    'heap',
    'bubble',
    'insertion',
    'bucket',
    'counting',
    'auto'
  ]).optional().default('auto'),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
});
