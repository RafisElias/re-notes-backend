import type { NextFunction, Request, Response } from 'express';

import { logEvents } from './logger.middleware';
import ErrorResponse from '../interfaces/ErrorResponse';
import { NODE_ENV } from '../config';

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  const message = `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`;

  res.statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });

  if (NODE_ENV !== 'test') logEvents(message, 'errLog.log');
  next();
}
