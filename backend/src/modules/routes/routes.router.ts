// import { Router, Request, Response } from 'express';
// import { z } from 'zod';
// import { prisma } from '../../database/prisma';
// import { authenticate, authorize, AuthRequest } from '../../middleware/auth.middleware';

// export const routesRouter = Router();

// routesRouter.get('/', async (req: Request, res: Response) => {
//   const page = Math.max(1, Number(req.query.page) || 1);
//   const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
//   const search = String(req.query.search || '').trim();
//   const transportType = req.query.transportType ? String(req.query.transportType) : undefined;
//   const status = req.query.status ? String(req.query.status) : undefined;
//   const sort = String(req.query.sort || 'routeNumber');
//   const order = String(req.query.order || 'asc') === 'desc' ? 'desc' : 'asc';

//   const where: any = {};
//   if (search) {
//     where.OR = [
//       { routeNumber: { contains: search, mode: 'insensitive' } },
//       { routeName: { contains: search, mode: 'insensitive' } },
//       { startLocation: { contains: search, mode: 'insensitive' } },
//       { endLocation: { contains: search, mode: 'insensitive' } },
//     ];
//   }
//   if (transportType) where.transportType = transportType;
//   if (status) where.status = status;

//   const [items, total] = await Promise.all([
//     prisma.route.findMany({
//       where,
//       skip: (page - 1) * limit,
//       take: limit,
//       orderBy: { [sort]: order },
//       include: { _count: { select: { routeStops: true } } },
//     }),
//     prisma.route.count({ where }),
//   ]);

//   res.json({ success: true, data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
// });

// routesRouter.get('/:id', async (req: Request, res: Response) => {
//   const route = await prisma.route.findUnique({
//     where: { id: req.params.id },
//     include: {
//       routeStops: { include: { stop: true }, orderBy: { stopOrder: 'asc' } },
//       schedules: true,
//     },
//   });
//   if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
//   res.json({ success: true, data: route });
// });

// routesRouter.get('/:id/schedules', async (req: Request, res: Response) => {
//   const schedules = await prisma.schedule.findMany({ where: { routeId: req.params.id } });
//   res.json({ success: true, data: schedules });
// });

// const routeSchema = z.object({
//   routeNumber: z.string().min(1),
//   routeName: z.string().min(2),
//   description: z.string().optional(),
//   startLocation: z.string(),
//   endLocation: z.string(),
//   transportType: z.enum(['BUS', 'METRO', 'TRAIN', 'TRAM', 'FERRY']),
//   estimatedDuration: z.number().int().positive(),
//   fare: z.number().optional(),
//   status: z.enum(['ACTIVE', 'SUSPENDED', 'MAINTENANCE']).optional(),
// });

// routesRouter.post('/', authenticate, authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
//   const parsed = routeSchema.safeParse(req.body);
//   if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed', details: parsed.error.flatten() });
//   const route = await prisma.route.create({ data: parsed.data });
//   res.status(201).json({ success: true, data: route });
// });

// routesRouter.put('/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
//   const parsed = routeSchema.partial().safeParse(req.body);
//   if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed' });
//   const route = await prisma.route.update({ where: { id: req.params.id }, data: parsed.data });
//   res.json({ success: true, data: route });
// });

// routesRouter.delete('/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
//   await prisma.route.delete({ where: { id: req.params.id } });
//   res.status(204).send();
// });
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../database/prisma';
import { authenticate, authorize, AuthRequest } from '../../middleware/auth.middleware';

export const routesRouter = Router();

routesRouter.get('/', async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const search = String(req.query.search || '').trim();
  const transportType = req.query.transportType ? String(req.query.transportType) : undefined;
  const status = req.query.status ? String(req.query.status) : undefined;
  const sort = String(req.query.sort || 'routeNumber');
  const order = String(req.query.order || 'asc') === 'desc' ? 'desc' : 'asc';

  const where: any = {};
  if (search) {
    where.OR = [
      { routeNumber: { contains: search, mode: 'insensitive' } },
      { routeName: { contains: search, mode: 'insensitive' } },
      { startLocation: { contains: search, mode: 'insensitive' } },
      { endLocation: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (transportType) where.transportType = transportType;
  if (status) where.status = status;

  const [items, total] = await Promise.all([
    prisma.route.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sort]: order },
      include: { _count: { select: { routeStops: true } } },
    }),
    prisma.route.count({ where }),
  ]);

  res.json({ success: true, data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

routesRouter.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string; // <-- FIXED HERE
  const route = await prisma.route.findUnique({
    where: { id },
    include: {
      routeStops: { include: { stop: true }, orderBy: { stopOrder: 'asc' } },
      schedules: true,
    },
  });
  if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
  res.json({ success: true, data: route });
});

routesRouter.get('/:id/schedules', async (req: Request, res: Response) => {
  const id = req.params.id as string; // <-- FIXED HERE
  const schedules = await prisma.schedule.findMany({ where: { routeId: id } });
  res.json({ success: true, data: schedules });
});

const routeSchema = z.object({
  routeNumber: z.string().min(1),
  routeName: z.string().min(2),
  description: z.string().optional(),
  startLocation: z.string(),
  endLocation: z.string(),
  transportType: z.enum(['BUS', 'METRO', 'TRAIN', 'TRAM', 'FERRY']),
  estimatedDuration: z.number().int().positive(),
  fare: z.number().optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'MAINTENANCE']).optional(),
});

routesRouter.post('/', authenticate, authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
  const parsed = routeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed', details: parsed.error.flatten() });
  const route = await prisma.route.create({ data: parsed.data });
  res.status(201).json({ success: true, data: route });
});

routesRouter.put('/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string; // <-- FIXED HERE
  const parsed = routeSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed' });
  const route = await prisma.route.update({ where: { id }, data: parsed.data });
  res.json({ success: true, data: route });
});

routesRouter.delete('/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string; // <-- FIXED HERE
  await prisma.route.delete({ where: { id } });
  res.status(204).send();
});