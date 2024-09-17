import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'TEST_TASK';
const JWT_REFRESH_SECRET = process.env.JWT_SECRET || 'JWT_REFRESH_SECRET';
const JWT_EXPIRATION = process.env.JWT_EXPIRES_IN || '10m';
const REFRESH_TOKEN_EXPIRATION = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid token');
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
};
