import { NextFunction, Request, Response } from 'express';
import { registerUser, authenticateUser, refreshToken, getUserInfo, logoutUser } from '../services/authService';

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with email, phone, and password, and returns access and refresh tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT token for accessing resources
 *                 refreshToken:
 *                   type: string
 *                   description: Token for refreshing accessToken
 *       400:
 *         description: Registration error
 */
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone, password } = req.body;
    const { accessToken, refreshToken } = await registerUser(email, phone, password);
    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: User login
 *     description: Authenticates a user using email/phone and password, and returns access and refresh tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - password
 *             properties:
 *               id:
 *                 type: string
 *                 description: Email or phone of the user
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT token for accessing resources
 *                 refreshToken:
 *                   type: string
 *                   description: Token for refreshing accessToken
 *       401:
 *         description: Invalid credentials
 */
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, password } = req.body;
    const deviceInfo = req.headers['user-agent'] || 'Unknown device';
    const { accessToken, refreshToken } = await authenticateUser(id, password, deviceInfo);
    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};


/**
 * @swagger
 * /signin/new_token:
 *   post:
 *     summary: Refresh access token
 *     description: Refreshes the access token using the provided refresh token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token used to generate a new access token
 *     responses:
 *       200:
 *         description: Tokens successfully refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT token for accessing resources
 *                 refreshToken:
 *                   type: string
 *                   description: New refresh token
 *       401:
 *         description: Invalid refresh token
 */
export const signInNewToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body;
    const deviceInfo = req.headers['user-agent'] || 'Unknown device';
    const { accessToken, refreshToken: newRefreshToken } = await refreshToken(token, deviceInfo);
    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /info:
 *   get:
 *     summary: Get user information
 *     description: Returns the user ID from the provided JWT token.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: User ID of the authenticated user
 *       401:
 *         description: Unauthorized access
 */
export const getUserInfoController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInfo = await getUserInfo(req);
    res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out user
 *     description: Logs out the user by invalidating the current refresh token.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token used to invalidate the session
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized access
 */
export const logoutUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await logoutUser(req);
    res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    next(error);
  }
};