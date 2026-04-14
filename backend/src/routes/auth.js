import { Router } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const { user, password } = req.body;

  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPassword) {
    return res.status(500).json({ error: 'Credenciales no configuradas en el servidor' });
  }

  if (user !== adminUser || password !== adminPassword) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  }

  const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});
