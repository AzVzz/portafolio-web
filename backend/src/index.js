import express from 'express';
import cors from 'cors';
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

// Rutas API
app.use('/api/hero', heroRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/uploads', uploadsRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
