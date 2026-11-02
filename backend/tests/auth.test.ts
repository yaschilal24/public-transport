import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/database/prisma';

describe('Routes API', () => {
  afterAll(async () => { await prisma.$disconnect(); });

  it('returns a paginated list of routes', async () => {
    const res = await request(app).get('/api/v1/routes?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toBeDefined();
  });

  it('returns 404 for unknown route id', async () => {
    const res = await request(app).get('/api/v1/routes/nonexistent');
    expect(res.status).toBe(404);
  });

  it('blocks unauthenticated route creation', async () => {
    const res = await request(app).post('/api/v1/routes').send({});
    expect(res.status).toBe(401);
  });
});