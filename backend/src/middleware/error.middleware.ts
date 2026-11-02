import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  if (process.env.NODE_ENV !== 'production') console.error(err);
  res.status(status).json({ success: false, message, ...(err.details ? { details: err.details } : {}) });
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ success: false, message: 'Route not found' });
}