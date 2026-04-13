import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';

const storage = multer.diskStorage({
  destination: 'data/uploads/',
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname);
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  },
});

export const uploadsRouter = Router();

uploadsRouter.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió archivo' });
  }
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});
