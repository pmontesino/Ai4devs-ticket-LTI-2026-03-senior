import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../types/candidate';

export function candidateErrorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.status).json({
      code: err.code,
      message: err.message,
      details: err.details,
    });
    return;
  }

  const prismaError = err as { name?: string; message?: string };
  if (
    prismaError?.name === 'PrismaClientInitializationError' ||
    (prismaError?.message && prismaError.message.includes("Can't reach database server"))
  ) {
    res.status(503).json({
      code: 'DATABASE_UNAVAILABLE',
      message: 'No se pudo conectar a la base de datos. Verifica que PostgreSQL este iniciado y DATABASE_URL sea correcto.',
      details: [],
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'Se produjo un error inesperado.',
    details: [],
  });
}
