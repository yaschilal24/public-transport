import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../database/prisma';
import { authenticate, AuthRequest } from '../../middleware/auth.middleware';

export const favoritesRouter = Router();
favoritesRouter.use(authenticate);

favoritesRouter.get('/', async (req: AuthRequest, res: Response) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId: req.user!.id },
    include: { route: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: favorites });
});

const favoriteSchema = z.object({ routeId: z.string() });

favoritesRouter.post('/', async (req: AuthRequest, res: Response) => {
  const parsed = favoriteSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed' });
  try {
    const fav = await prisma.favorite.create({ data: { userId: req.user!.id, routeId: parsed.data.routeId }, include: { route: true } });
    res.status(201).json({ success: true, data: fav });
  } catch {
    res.status(409).json({ success: false, message: 'Already in favorites' });
  }
});

favoritesRouter.delete('/:routeId', async (req: AuthRequest, res: Response) => {
  await prisma.favorite.deleteMany({ where: { userId: req.user!.id, routeId: req.params.routeId } });
  res.status(204).send();
});