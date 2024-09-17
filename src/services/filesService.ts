import { File } from '../../database/models';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const DEFAULT_PAGE = parseInt(process.env.DEFAULT_PAGE || '1', 10);
const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_LIMIT || '10', 10);

export const uploadFile = async (
  userId: string,
  fileName: string,
  mimeType: string,
  extension: string,
  fileSize: number,
  filePath: string,
) => {
  return await File.create({
    id: uuidv4(),
    userId,
    fileName,
    mimeType,
    extension,
    fileSize,
    filePath,
  });
};

export const listFiles = async (list_size?: number, page?: number) => {
  const limit = list_size || DEFAULT_LIMIT;
  const currentPage = page || DEFAULT_PAGE;
  const offset = (currentPage - 1) * limit;

  return await File.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
};

export const deleteFile = async (fileId: string) => {
  const file = await File.findByPk(fileId);
  if (!file) throw new Error('File not found');

  const filePath = path.resolve(file.filePath);
  fs.unlinkSync(filePath);

  await file.destroy();
};

export const getFileById = async (fileId: string) => {
  const file = await File.findByPk(fileId);
  if (!file) throw new Error('File not found');
  return file;
};

export const downloadFile = async (fileId: string) => {
  const file = await File.findByPk(fileId);
  if (!file) throw new Error('File not found');

  return path.resolve(file.filePath);
};

export const updateFile = async (
  fileId: string,
  newFileName: string,
  newMimeType: string,
  newExtension: string,
  newFileSize: number,
  newFilePath: string,
) => {
  const file = await File.findByPk(fileId);
  if (!file) throw new Error('File not found');

  const oldFilePath = path.resolve(file.filePath);
  fs.unlinkSync(oldFilePath);

  file.fileName = newFileName;
  file.mimeType = newMimeType;
  file.extension = newExtension;
  file.fileSize = newFileSize;
  file.filePath = newFilePath;

  await file.save();
  return file;
};
