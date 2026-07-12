import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const message = err.message || 'Internal Server Error';
  let statusCode = 500;

  if (message.includes('not found')) {
    statusCode = 404;
  } else if (
    message.includes('already registered') ||
    message.includes('already exists')
  ) {
    statusCode = 400; // or 409 Conflict
  } else if (
    message.includes('Invalid email or password') ||
    message.includes('Access token missing') ||
    message.includes('Invalid or expired')
  ) {
    statusCode = 401;
  } else if (message.includes('forbidden') || message.includes('Admins only')) {
    statusCode = 403;
  } else if (
    message.includes('stock') ||
    message.includes('greater than zero') ||
    message.includes('Validation')
  ) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
};
