import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../types/candidate';

const ALLOWED_ROLES = ['recruiter', 'admin'];

export function enforceCvAccess(req: Request, _res: Response, next: NextFunction): void {
  const role = (req.header('x-user-role') || '').toLowerCase();
  if (!ALLOWED_ROLES.includes(role)) {
    return next(new AppError('FORBIDDEN', 'No tienes permisos para acceder al CV.', 403));
  }

  next();
}
