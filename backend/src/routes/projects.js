import { Router } from 'express';
import { readJSON, writeJSON } from '../utils/db.js';

const DATA_PATH = 'data/projects.json';

export const projectsRouter = Router();

projectsRouter.get('/', async (_req, res) => {
  const data = await readJSON(DATA_PATH);
  res.json(data ?? []);
});

projectsRouter.put('/', async (req, res) => {
  await writeJSON(DATA_PATH, req.body);
  res.json({ ok: true });
});
