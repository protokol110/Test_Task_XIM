import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

export const validateSignIn = (req: Request, res: Response, next: NextFunction) => {
  const { id, password } = req.body;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID is required and must be a string' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required and must be a string' });
  }

  if (!validator.isEmail(id) && !validator.isMobilePhone(id, 'any', { strictMode: false })) {
    return res.status(400).json({ error: 'ID must be a valid email or phone number' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  next();
};

export const validateSignUp = (req: Request, res: Response, next: NextFunction) => {
  const { email, phone, password } = req.body;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required and must be a string' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  if (!email && !phone) {
    return res.status(400).json({ error: 'Either email or phone is required' });
  }

  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (phone && !validator.isMobilePhone(phone, 'any', { strictMode: false })) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  next();
};

