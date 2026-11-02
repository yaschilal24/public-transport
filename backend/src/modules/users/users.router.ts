import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../../database/prisma';
import { authenticate, AuthRequest } from '../../middleware/auth.middleware';

export const usersRouter = Router();
usersRouter.use(authenticate);

usersRouter.get('/profile', async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, fullName: true, email: true, phone: true, profileImage: true, role: true, createdAt: true },
  });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
});

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  profileImage: z.string().url().optional(),
});

usersRouter.put('/profile', async (req: AuthRequest, res: Response) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed', details: parsed.error.flatten() });
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: parsed.data,
    select: { id: true, fullName: true, email: true, phone: true, profileImage: true, role: true },
  });
  res.json({ success: true, data: user });
});

const passwordSchema = z.object({ currentPassword: z.string(), newPassword: z.string().min(8) });

usersRouter.patch('/password', async (req: AuthRequest, res: Response) => {
  const parsed = passwordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed' });
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const ok = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!ok) return res.status(401).json({ success: false, message: 'Current password incorrect' });
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12) } });
  res.json({ success: true, message: 'Password updated' });
});

usersRouter.delete('/account', async (req: AuthRequest, res: Response) => {
  await prisma.user.delete({ where: { id: req.user!.id } });
  res.status(204).send();
});