import { Router, Request, Response } from 'express';
import { prisma } from '../../database/prisma';

export const searchRouter = Router();

searchRouter.get('/', async (req: Request, res: Response) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json({ success: true, data: { routes: [], stops: [] } });

  const [routes, stops] = await Promise.all([
    prisma.route.findMany({
      where: {
        OR: [
          { routeNumber: { contains: q, mode: 'insensitive' } },
          { routeName: { contains: q, mode: 'insensitive' } },
          { startLocation: { contains: q, mode: 'insensitive' } },
          { endLocation: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 10,
    }),
    prisma.stop.findMany({
      where: { OR: [{ stopName: { contains: q, mode: 'insensitive' } }, { address: { contains: q, mode: 'insensitive' } }] },
      take: 10,
    }),
  ]);
  res.json({ success: true, data: { routes, stops } });
});

searchRouter.get('/routes', async (req: Request, res: Response) => {
  const q = String(req.query.q || '').trim();
  const routes = q
    ? await prisma.route.findMany({
        where: {
          OR: [
            { routeNumber: { contains: q, mode: 'insensitive' } },
            { routeName: { contains: q, mode: 'insensitive' } },
            { startLocation: { contains: q, mode: 'insensitive' } },
            { endLocation: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 20,
      })
    : [];
  res.json({ success: true, data: routes });
});

searchRouter.get('/destinations', async (req: Request, res: Response) => {
  const q = String(req.query.q || '').trim();
  const stops = q
    ? await prisma.stop.findMany({ where: { stopName: { contains: q, mode: 'insensitive' } }, take: 20 })
    : [];
  res.json({ success: true, data: stops });
});