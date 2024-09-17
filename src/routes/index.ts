import { Router } from 'express';
import authRoutes from './authRoute';
import fileRoute from './fileRoute';


const router = Router();

router.use('/', authRoutes);
router.use('/file', fileRoute);



export default router;
