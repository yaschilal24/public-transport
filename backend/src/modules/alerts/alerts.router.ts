import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../database/prisma';
import { authenticate, authorize, AuthRequest } from '../../middleware/auth.middleware';

export const alertsRouter = Router();

alertsRouter.get('/', async (_req: Request, res: Response) => {
  const alerts = await prisma.serviceAlert.findMany({
    where: { status: 'ACTIVE' },
    include: { route: true, stop: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: alerts });
});

alertsRouter.get('/:id', async (req: Request, res: Response) => {
  const alert = await prisma.serviceAlert.findUnique({ where: { id: req.params.id }, include: { route: true, stop: true } });
  if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
  res.json({ success: true, data: alert });
});

const alertSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  routeId: z.string().optional(),
  stopId: z.string().optional(),
  startDate: z.string(),
  expirationDate: z.string().optional(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'SCHEDULED']).optional(),
});

alertsRouter.post('/', authenticate, authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
  const parsed = alertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed' });
  const alert = await prisma.serviceAlert.create({
    data: {
      ...parsed.data,
      startDate: new Date(parsed.data.startDate),
      expirationDate: parsed.data.expirationDate ? new Date(parsed.data.expirationDate) : null,
    },
  });
  res.status(201).json({ success: true, data: alert });
});

alertsRouter.put('/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
  const parsed = alertSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed' });
  const data: any = { ...parsed.data };
  if (data.startDate) data.startDate = new Date(data.startDate);
  if (data.expirationDate) data.expirationDate = new Date(data.expirationDate);
  const alert = await prisma.serviceAlert.update({ where: { id: req.params.id }, data });
  res.json({ success: true, data: alert });
});

alertsRouter.delete('/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
  await prisma.serviceAlert.delete({ where: { id: req.params.id } });
  res.status(204).send();
});