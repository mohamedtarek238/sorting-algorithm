// src/services/systemService.ts
import { createLogger, transports, format } from 'winston';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { LRUCache } from 'lru-cache';

// register file info 
export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [new transports.Console()],
});

// systeam rating req
export const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 1,
});

// casheing system
export const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 1000 * 60 * 5,
});

// handeling 
class PriorityQueue {
  private heap: Array<{ task: () => Promise<any>, priority: number }> = [];
  private priorityMap = { high: 1, medium: 2, low: 3 };

  enqueue(task: () => Promise<any>, priority: string) {
    const priorityValue = this.priorityMap[priority];
    this.heap.push({ task, priority: priorityValue });
    this.heap.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.heap.shift()?.task;
  }

  get length() {
    return this.heap.length;
  }
}

// 3 leval procsesing req
export const priorityQueue = {
  high: new PriorityQueue(),
  medium: new PriorityQueue(),
  low: new PriorityQueue(),
};
