import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../database/prisma';
import { authenticate, authorize, AuthRequest } from '../../middleware/auth.middleware';

export const stopsRouter = Router();

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

stopsRouter.get('/nearby', async (req: Request, res: Response) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radiusKm = Number(req.query.radius) || 2;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ success: false, message: 'lat and lng are required' });
  }
  const stops = await prisma.stop.findMany();
  const results = stops
    .map((s) => ({ ...s, distanceKm: haversineKm(lat, lng, s.latitude, s.longitude) }))
    .filter((s) => s.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 20);
  res.json({ success: true, data: results });
});

stopsRouter.get('/', async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const search = String(req.query.search || '').trim();
  const where = search ? { stopName: { contains: search, mode: 'insensitive' as const } } : {};
  const [items, total] = await Promise.all([
    prisma.stop.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { stopName: 'asc' } }),
    prisma.stop.count({ where }),
  ]);
  res.json({ success: true, data: items, meta: { page, limit, total } });
});

stopsRouter.get('/:id', async (req: Request, res: Response) => {
  const stop = await prisma.stop.findUnique({
    where: { id: req.params.id },
    include: { routeStops: { include: { route: true } } },
  });
  if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });
  res.json({ success: true, data: stop });
});

stopsRouter.get('/:id/routes', async (req: Request, res: Response) => {
  const routeStops = await prisma.routeStop.findMany({ where: { stopId: req.params.id }, include: { route: true } });
  res.json({ success: true, data: routeStops.map((rs) => rs.route) });
});

const stopSchema = z.object({
  stopName: z.string().min(2),
  description: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
});

stopsRouter.post('/', authenticate, authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
  const parsed = stopSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed' });
  const stop = await prisma.stop.create({ data: parsed.data });
  res.status(201).json({ success: true, data: stop });
});

stopsRouter.put('/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
  const parsed = stopSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed' });
  const stop = await prisma.stop.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ success: true, data: stop });
});

stopsRouter.delete('/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
  await prisma.stop.delete({ where: { id: req.params.id } });
  res.status(204).send();
});