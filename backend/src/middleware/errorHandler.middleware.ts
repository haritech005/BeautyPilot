import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Backend Global Error Handler]:', err.stack || err);

  // Handle JSON syntax parsing errors (e.g., malformed body)
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    res.status(400).json({
      success: false,
      error: 'Malformed JSON payload in request body.',
    });
    return;
  }

  // Handle Prisma Database connection / query errors
  if (err.code && typeof err.code === 'string' && err.code.startsWith('P')) {
    res.status(503).json({
      success: false,
      error: 'Database service is currently unavailable or encountered a query error.',
      code: err.code,
    });
    return;
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'An unexpected server error occurred.',
  });
}
