import { Users, UserTokens } from '../../database/models';
import bcrypt from 'bcryptjs';
import { verifyRefreshToken, generateTokens } from '../utils/jwt';
import { Op } from 'sequelize';
import { UnauthorizedError, VerificationError } from '../typings/CustomErrors';
import { v4 as uuidv4 } from 'uuid';
import { CustomRequest } from '../typings/CustomRequest';

export const registerUser = async (email: string, phone: string, password: string) => {
  const existingUser = await Users.findOne({ where: { [Op.or]: [{ email }, { phone }] } });
  if (existingUser) {
    throw new VerificationError('User with this email or phone already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await Users.create({ email, phone, password: hashedPassword, isActive: true });
  const { accessToken, refreshToken } = await generateAndSaveTokens(newUser.id);

  return { accessToken, refreshToken };
};

export const authenticateUser = async (id: string, password: string, deviceInfo: string) => {
  const user = await Users.findOne({ where: { [Op.or]: [{ email: id }, { phone: id }] } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError('Invalid email/phone or password');
  }

  const { accessToken, refreshToken } = await generateAndSaveTokens(user.id, deviceInfo);

  return { accessToken, refreshToken };
};

const generateAndSaveTokens = async (userId: string, deviceInfo: string = '') => {
  const { accessToken, refreshToken } = generateTokens(userId);

  await UserTokens.create({
    id: uuidv4(),
    userId,
    refreshToken,
    deviceInfo,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30d
  });

  return { accessToken, refreshToken };
};

export const refreshToken = async (token: string, deviceInfo: string) => {
  const decoded = verifyRefreshToken(token) as { userId: string };

  if (!decoded) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  const tokenRecord = await UserTokens.findOne({ where: { refreshToken: token, userId: decoded.userId } });

  if (!tokenRecord) {
    throw new UnauthorizedError('Token not found or expired');
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateAndSaveTokens(decoded.userId, deviceInfo);

  await tokenRecord.destroy();

  return { accessToken, refreshToken: newRefreshToken };
};

export const getUserInfo = async (req: CustomRequest) => {
  return { userId: req.user?.userId };
};

export const logoutUser = async (req: CustomRequest) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.split(' ')[1];

  const decoded = verifyRefreshToken(token) as { userId: string };
  if (!decoded) {
    throw new UnauthorizedError('Invalid token');
  }

  await UserTokens.destroy({ where: { refreshToken: token, userId: decoded.userId } });
};

