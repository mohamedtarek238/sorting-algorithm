//analyzeController.ts
import { Request, Response } from 'express';
import { suggestAlgorithms, checkIfSorted } from '../services/sortingService';
import { handleError } from '../utils/errorHandler';

export const analyzeData = (req: Request, res: Response): void => {
  try {
    const data: number[] = req.body.data;
    const analysis = {
      length: data.length,
      min: Math.min(...data),
      max: Math.max(...data),
      isSorted: checkIfSorted(data),
      suggestedAlgorithms: suggestAlgorithms(data)
    };
    res.json(analysis);
  } catch (err) {
    handleError(err, res);
  }
};
