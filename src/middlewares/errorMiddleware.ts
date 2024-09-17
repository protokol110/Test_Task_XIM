import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../typings/CustomErrors';

export const errorMiddleware = (err: CustomError | Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Internal Server Error' });
};