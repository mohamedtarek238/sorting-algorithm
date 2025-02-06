//sortRoutes
import { Router } from 'express';
import { sortData } from '../controllers/sortController';

const router = Router();

router.post('/', sortData);

export default router;
