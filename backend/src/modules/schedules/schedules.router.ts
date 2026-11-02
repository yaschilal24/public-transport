import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../database/prisma';
import { authenticate, authorize, AuthRequest } from '../../middleware/auth.middleware';

export const schedulesRouter = Router();

schedulesRouter.get('/', async (req: Request, res: Response) => {
  const routeId = req.query.routeId ? String(req.query.routeId) : undefined;
  const where = routeId ? { routeId } : {};
  const schedules = await prisma.schedule.findMany({ where, include: { route: true } });
  res.json({ success: true, data: schedules });
});

schedulesRouter.get('/:id', async (req: Request, res: Response) => {
  const schedule = await prisma.schedule.findUnique({ where: { id: req.params.id }, include: { route: true } });
  if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });
  res.json({ success: true, data: schedule });
});

const scheduleSchema = z.object({
  routeId: z.string(),
  departureTime: z.string(),
  arrivalTime: z.string(),
  operatingDays: z.string(),
  frequency: z.number().int().optional(),
  scheduleType: z.string().optional(),
});

schedulesRouter.post('/', authenticate, authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
  const parsed = scheduleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed' });
  const schedule = await prisma.schedule.create({ data: parsed.data });
  res.status(201).json({ success: true, data: schedule });
});

schedulesRouter.delete('/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
  await prisma.schedule.delete({ where: { id: req.params.id } });
  res.status(204).send();
});