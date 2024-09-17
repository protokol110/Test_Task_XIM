import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { CustomRequest } from '../typings/CustomRequest';
import { UnauthorizedError, ForbiddenError } from '../typings/CustomErrors';

export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyToken(token);
      req.user = decoded as { userId: string };
      next();
    } catch (err) {
      next(new ForbiddenError('Forbidden: Invalid token'));
    }
  } else {
    next(new UnauthorizedError('Unauthorized: No token provided'));
  }
};
