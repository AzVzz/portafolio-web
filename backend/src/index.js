import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { authMiddleware } from './middleware/auth.js';
import { heroRouter } from './routes/hero.js';
import { experienceRouter } from './routes/experience.js';
import { projectsRouter } from './routes/projects.js';
import { uploadsRouter } from './routes/uploads.js';

const app = express();
const PORT = process.env.PORT || 4400;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Servir archivos subidos
app.use('/uploads', express.static('data/uploads'));

// Rutas públicas
app.use('/api/auth', authRouter);
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Rutas protegidas
app.use('/api/hero', authMiddleware, heroRouter);
app.use('/api/experience', authMiddleware, experienceRouter);
app.use('/api/projects', authMiddleware, projectsRouter);
app.use('/api/uploads', authMiddleware, uploadsRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
