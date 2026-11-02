import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../../database/prisma';
import { env } from '../../config/env';
import { authenticate, AuthRequest } from '../../middleware/auth.middleware';

export const authRouter = Router();

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
});

authRouter.post('/register', async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ success: false, message: 'Validation failed', details: parsed.error.flatten() });
  }
  const { fullName, email, phone, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { fullName, email, phone, passwordHash } });

  const accessToken = jwt.sign({ userId: user.id, role: user.role, email: user.email }, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
  const refreshToken = jwt.sign({ userId: user.id }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });

  res.status(201).json({
    success: true,
    data: { user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }, accessToken, refreshToken },
  });
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

authRouter.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed', details: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const accessToken = jwt.sign({ userId: user.id, role: user.role, email: user.email }, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
  const refreshToken = jwt.sign({ userId: user.id }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });

  res.json({
    success: true,
    data: { user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }, accessToken, refreshToken },
  });
});

authRouter.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { id: true, fullName: true, email: true, phone: true, role: true, createdAt: true } });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
});