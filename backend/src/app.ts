import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler, notFound } from './middleware/error.middleware';
import { authRouter } from './modules/auth/auth.router';
import { usersRouter } from './modules/users/users.router';
import { routesRouter } from './modules/routes/routes.router';
import { stopsRouter } from './modules/stops/stops.router';
import { schedulesRouter } from './modules/schedules/schedules.router';
import { searchRouter } from './modules/search/search.router';
import { favoritesRouter } from './modules/favorites/favorites.router';
import { reportsRouter } from './modules/reports/reports.router';
import { alertsRouter } from './modules/alerts/alerts.router';
import { notificationsRouter } from './modules/notifications/notifications.router';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: '5mb' }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use('/api/v1/auth', authLimiter, authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/routes', routesRouter);
app.use('/api/v1/stops', stopsRouter);
app.use('/api/v1/schedules', schedulesRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/favorites', favoritesRouter);
app.use('/api/v1/reports', reportsRouter);
app.use('/api/v1/alerts', alertsRouter);
app.use('/api/v1/notifications', notificationsRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(notFound);
app.use(errorHandler);