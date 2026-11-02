import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../database/prisma';
import { authenticate, AuthRequest } from '../../middleware/auth.middleware';

export const notificationsRouter = Router();
notificationsRouter.use(authenticate);

notificationsRouter.get('/', async (req: AuthRequest, res: Response) => {
  const items = await prisma.notification.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: items });
});

notificationsRouter.patch('/read-all', async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({ where: { userId: req.user!.id, isRead: false }, data: { isRead: true } });
  res.json({ success: true });
});

notificationsRouter.patch('/:id/read', async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({ where: { id: req.params.id, userId: req.user!.id }, data: { isRead: true } });
  res.json({ success: true });
});

notificationsRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  await prisma.notification.deleteMany({ where: { id: req.params.id, userId: req.user!.id } });
  res.status(204).send();
});

const tokenSchema = z.object({ expoPushToken: z.string(), platform: z.string() });

notificationsRouter.post('/device-token', async (req: AuthRequest, res: Response) => {
  const parsed = tokenSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed' });
  const token = await prisma.deviceToken.upsert({
    where: { expoPushToken: parsed.data.expoPushToken },
    update: { userId: req.user!.id, platform: parsed.data.platform },
    create: { userId: req.user!.id, expoPushToken: parsed.data.expoPushToken, platform: parsed.data.platform },
  });
  res.status(201).json({ success: true, data: token });
});