import { Router } from 'express';
import {
  getUserInfoController,
  logoutUserController,
  signIn,
  signInNewToken,
  signUp,
} from '../controllers/authController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';
import { validateSignIn, validateSignUp } from '../middlewares/authMiddleware';

const router = Router();

router.post('/signin', validateSignIn, signIn);
router.post('/signin/new_token', signInNewToken);
router.post('/signup', validateSignUp, signUp);

router.get('/info', authenticateJWT, getUserInfoController);
router.get('/logout', authenticateJWT, logoutUserController);

export default router;
