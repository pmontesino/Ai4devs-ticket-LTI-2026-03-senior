import fs from 'fs';
import path from 'path';
import { Express } from 'express';
import { AppError } from '../types/candidate';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export const FILE_STORAGE_RULES = {
  ALLOWED_MIME_TYPES,
  MAX_SIZE_BYTES,
};

export function getUploadDir(): string {
  const configuredDir = process.env.UPLOAD_DIR || 'uploads';
  const absolutePath = path.resolve(process.cwd(), configuredDir);
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
  }
  return absolutePath;
}

export function validateCvFile(file?: Express.Multer.File): void {
  if (!file) {
    return;
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new AppError('INVALID_FILE_TYPE', 'Solo se permiten archivos PDF o DOCX.', 400);
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new AppError('FILE_TOO_LARGE', 'El CV supera el maximo permitido de 10 MB.', 413);
  }
}

export function persistCvFile(file: Express.Multer.File): string {
  validateCvFile(file);
  const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
  const finalPath = path.join(getUploadDir(), fileName);
  fs.writeFileSync(finalPath, file.buffer);
  return finalPath;
}
