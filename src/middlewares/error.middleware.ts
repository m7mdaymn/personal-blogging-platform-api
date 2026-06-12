import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      sendError(res, `A record with this ${target} already exists`, 409);
      return;
    }

    if (err.code === 'P2025') {
      sendError(res, 'Record not found', 404);
      return;
    }

    if (err.code === 'P2023') {
      sendError(res, 'Invalid input format', 400);
      return;
    }
  }

  console.error('Unexpected error:', err);

  sendError(res, 'Internal server error', 500);
};
