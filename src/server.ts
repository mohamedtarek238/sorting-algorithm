// src/server.ts
import cluster from 'cluster';
import os from 'os';
import express from 'express';
import { json } from 'express';
import { logger } from './services/systemService';
import sortRoutes from './routes/sortRoutes';
import analyzeRoutes from './routes/analyzeRoutes';

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 3000;

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    logger.error(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();
  app.use(json({ limit: '10mb' }));

  //routers
  app.use('/sort', sortRoutes);
  app.use('/analyze', analyzeRoutes);

  app.listen(PORT, () => {
    logger.info(`Worker ${process.pid} running on port ${PORT}`);
  });
}
