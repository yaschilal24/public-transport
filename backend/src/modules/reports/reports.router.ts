import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../database/prisma';
import { authenticate, authorize, AuthRequest } from '../../middleware/auth.middleware';

export const reportsRouter = Router();
reportsRouter.use(authenticate);

reportsRouter.get('/', async (req: AuthRequest, res: Response) => {
  const where = req.user!.role === 'ADMIN' ? {} : { userId: req.user!.id };
  const reports = await prisma.report.findMany({
    where,
    include: { route: true, stop: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: reports });
});

reportsRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  const report = await prisma.report.findUnique({
    where: { id: req.params.id },
    include: { route: true, stop: true, user: { select: { id: true, fullName: true, email: true } } },
  });
  if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
  if (req.user!.role !== 'ADMIN' && report.userId !== req.user!.id) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  res.json({ success: true, data: report });
});

const createSchema = z.object({
  category: z.enum(['DELAY', 'DAMAGED_VEHICLE', 'UNSAFE_CONDITION', 'INCORRECT_INFO', 'MISSING_STOP', 'OTHER']),
  description: z.string().min(5),
  routeId: z.string().optional(),
  stopId: z.string().optional(),
  imageUrl: z.string().url().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

reportsRouter.post('/', async (req: AuthRequest, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed', details: parsed.error.flatten() });
  const report = await prisma.report.create({ data: { ...parsed.data, userId: req.user!.id } });
  res.status(201).json({ success: true, data: report });
});

const patchSchema = z.object({ status: z.enum(['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED']) });

reportsRouter.patch('/:id', authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed' });
  const report = await prisma.report.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ success: true, data: report });
});