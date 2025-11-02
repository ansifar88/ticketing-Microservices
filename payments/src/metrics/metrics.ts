import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';

// Collect system-level metrics (CPU, memory, GC, etc.)
client.collectDefaultMetrics();

// Histogram: request duration
const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['service', 'method', 'route', 'status_code'],
  buckets: [50, 100, 300, 500, 1000, 3000],
});

// Counter: total requests
const httpRequestCount = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['service', 'method', 'route', 'status_code'],
});

// Counter: error requests
const httpErrorCount = new client.Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP error responses',
  labelNames: ['service', 'method', 'route', 'status_code'],
});

const SERVICE_NAME = process.env.SERVICE_NAME || 'unknown_service';

// Middleware to record metrics
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const end = httpRequestDurationMs.startTimer();

  res.on('finish', () => {
    const labels = {
      service: SERVICE_NAME,
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode.toString(),
    };

    httpRequestCount.inc(labels);
    if (res.statusCode >= 400) httpErrorCount.inc(labels);
    end(labels);
  });

  next();
};

// Handler for /metrics endpoint
export const metricsHandler = async (_req: Request, res: Response) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
};
