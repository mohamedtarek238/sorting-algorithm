//sortController
import { Request, Response } from 'express';
import { SortSchema } from '../utils/validation';
import { rateLimiter, cache, priorityQueue, logger } from '../services/systemService';
import { sortingStrategies, autoSelectAlgorithm } from '../services/sortingService';
import { handleError } from '../utils/errorHandler';

export const sortData = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.ip) {
      await rateLimiter.consume(req.ip);
    } else {
      throw new Error('IP address is undefined');
    }
    const { data, algorithm, priority } = SortSchema.parse(req.body);
    
    const cacheKey = `${algorithm}:${data.join(',')}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const selectedAlgorithm = algorithm === 'auto' 
      ? autoSelectAlgorithm(data) 
      : algorithm;

    const start = process.hrtime();

    const task = async (): Promise<void> => {
      try {
        const sorted = sortingStrategies[selectedAlgorithm]([...data]);
        const metrics = {
          algorithm: selectedAlgorithm,
          executionTime: process.hrtime(start)[1] / 1e6,
          memoryUsage: process.memoryUsage().heapUsed
        };
        const result = { result: sorted, metrics };
        cache.set(cacheKey, result);
        res.json(result);
      } catch (err) {
        handleError(err, res);
      }
    };

    // enqueue
    priorityQueue[priority].enqueue(task, priority);

    if (priorityQueue[priority].length === 1) {
      const nextTask = priorityQueue[priority].dequeue();
      if (nextTask) await nextTask();
    }
  } catch (err) {
    handleError(err, res);
  }
};
