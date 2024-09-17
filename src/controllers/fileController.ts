import { Request, Response, NextFunction } from 'express';
import {
  listFiles,
  uploadFile,
  getFileById,
  deleteFile,
  updateFile,
  downloadFile,
} from '../services/filesService';
import { upload } from '../middlewares/UploadFilesMiddleware';
import { CustomRequest } from '../typings/CustomRequest';
import path from 'path';

/**
 * @swagger
 * /file/upload:
 *   post:
 *     summary: Upload a new file
 *     description: Uploads a new file to the system and records file details in the database.
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *     responses:
 *       201:
 *         description: File successfully uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: File ID
 *                 userId:
 *                   type: string
 *                   description: ID of the user who uploaded the file
 *                 fileName:
 *                   type: string
 *                   description: Name of the file
 *                 mimeType:
 *                   type: string
 *                   description: MIME type of the file
 *                 extension:
 *                   type: string
 *                   description: File extension
 *                 fileSize:
 *                   type: integer
 *                   description: Size of the file in bytes
 *                 filePath:
 *                   type: string
 *                   description: Path where the file is stored
 *       400:
 *         description: No file uploaded or invalid file
 */
export const uploadFileController = (req: CustomRequest, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { originalname, mimetype, size, path: filePath } = req.file;
      const file = await uploadFile(
        req.user?.userId || '',
        originalname,
        mimetype,
        path.extname(originalname),
        size,
        filePath,
      );

      return res.status(201).json(file);
    } catch (error) {
      next(error);
    }
  });
};

/**
 * @swagger
 * /file/list:
 *   get:
 *     summary: List files with pagination
 *     description: Retrieves a list of files with optional pagination.
 *     tags: [Files]
 *     parameters:
 *       - name: list_size
 *         in: query
 *         required: false
 *         description: Number of files per page
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of files with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of files
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: File ID
 *                       userId:
 *                         type: string
 *                         description: ID of the user who uploaded the file
 *                       fileName:
 *                         type: string
 *                         description: Name of the file
 *                       mimeType:
 *                         type: string
 *                         description: MIME type of the file
 *                       extension:
 *                         type: string
 *                         description: File extension
 *                       fileSize:
 *                         type: integer
 *                         description: Size of the file in bytes
 *                       filePath:
 *                         type: string
 *                         description: Path where the file is stored
 *       400:
 *         description: Invalid query parameters
 */
export const listFilesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listSize = parseInt(req.query.list_size as string, 10) || undefined;
    const page = parseInt(req.query.page as string, 10) || undefined;

    const files = await listFiles(listSize, page);
    return res.status(200).json(files);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /file/{id}:
 *   get:
 *     summary: Get file by ID
 *     description: Retrieves details of a file by its ID.
 *     tags: [Files]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: File ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: File ID
 *                 userId:
 *                   type: string
 *                   description: ID of the user who uploaded the file
 *                 fileName:
 *                   type: string
 *                   description: Name of the file
 *                 mimeType:
 *                   type: string
 *                   description: MIME type of the file
 *                 extension:
 *                   type: string
 *                   description: File extension
 *                 fileSize:
 *                   type: integer
 *                   description: Size of the file in bytes
 *                 filePath:
 *                   type: string
 *                   description: Path where the file is stored
 *       404:
 *         description: File not found
 */
export const getFileByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fileId = req.params.id;
    const file = await getFileById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    return res.status(200).json(file);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /file/delete/{id}:
 *   delete:
 *     summary: Delete file by ID
 *     description: Deletes a file from the system and the database.
 *     tags: [Files]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: File ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: File successfully deleted
 *       404:
 *         description: File not found
 */
export const deleteFileByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fileId = req.params.id;
    await deleteFile(fileId);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /file/download/{id}:
 *   get:
 *     summary: Download file by ID
 *     description: Downloads a file by its ID.
 *     tags: [Files]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: File ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File download
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 */
export const downloadFileByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fileId = req.params.id;
    const filePath = await downloadFile(fileId);

    if (!filePath) {
      return res.status(404).json({ message: 'File not found' });
    }

    return res.download(filePath);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /file/update/{id}:
 *   put:
 *     summary: Update file by ID
 *     description: Updates an existing file in the system and database.
 *     tags: [Files]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: File ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: New file to upload
 *     responses:
 *       200:
 *         description: File successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: File ID
 *                 userId:
 *                   type: string
 *                   description: ID of the user who uploaded the file
 *                 fileName:
 *                   type: string
 *                   description: Name of the file
 *                 mimeType:
 *                   type: string
 *                   description: MIME type of the file
 *                 extension:
 *                   type: string
 *                   description: File extension
 *                 fileSize:
 *                   type: integer
 *                   description: Size of the file in bytes
 *                 filePath:
 *                   type: string
 *                   description: Path where the file is stored
 *       400:
 *         description: No file uploaded or invalid file
 *       404:
 *         description: File not found
 */
export const updateFileByIdController = (req: Request, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    try {
      const fileId = req.params.id;

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { originalname, mimetype, size, path: filePath } = req.file;

      const updatedFile = await updateFile(
        fileId,
        originalname,
        mimetype,
        path.extname(originalname),
        size,
        filePath,
      );

      if (!updatedFile) {
        return res.status(404).json({ message: 'File not found' });
      }

      return res.status(200).json(updatedFile);
    } catch (error) {
      next(error);
    }
  });
};
