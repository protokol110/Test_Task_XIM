import { Router } from 'express';
import { authenticateJWT } from '../middlewares/jwtMiddleware';
import { upload } from '../middlewares/UploadFilesMiddleware';
import {
  deleteFileByIdController, downloadFileByIdController,
  getFileByIdController,
  listFilesController, updateFileByIdController,
  uploadFileController,
} from '../controllers/fileController';

const router = Router();

router.post('/upload', authenticateJWT, upload.single('file'), uploadFileController);

router.get('/list', authenticateJWT, listFilesController);

router.get('/:id', authenticateJWT, getFileByIdController);

router.delete('/delete/:id', authenticateJWT, deleteFileByIdController);
router.get('/download/:id', authenticateJWT, downloadFileByIdController);
router.put('/update/:id', authenticateJWT, upload.single('file'), updateFileByIdController);

export default router;

