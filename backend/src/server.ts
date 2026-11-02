import { app } from './app';
import { env } from './config/env';
import { prisma } from './database/prisma';

async function bootstrap() {
  await prisma.$connect();
  app.listen(env.PORT, '0.0.0.0', () => console.log(`Backend running on http://0.0.0.0:${env.PORT}`));
  console.log( "database is connected successfully");
}

bootstrap().catch((e) => { console.error(e); process.exit(1); });