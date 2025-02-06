//analyzeRoutes
import { Router } from 'express';
import { analyzeData } from '../controllers/analyzeController';

const router = Router();

router.post('/', analyzeData);

export default router;
