import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

const uploadDirectory = fileURLToPath(new URL('../../uploads', import.meta.url));
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${randomUUID()}${extension}`);
  }
});

const imageOnly = (req, file, callback) => {
  if (file.mimetype.startsWith('image/')) return callback(null, true);
  const error = new Error('Only image files are allowed');
  error.statusCode = 400;
  callback(error);
};

export const listingImages = multer({
  storage,
  fileFilter: imageOnly,
  limits: { files: 5, fileSize: 5 * 1024 * 1024 }
}).array('photos', 5);
