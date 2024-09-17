import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const uploadDirectory = path.join(__dirname, '../../uploads/');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${uuidv4()}-${Date.now()}`;
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);

    cb(null, `${baseName}-${uniqueSuffix}${fileExtension}`);
  },
});

export const upload = multer({ storage });
