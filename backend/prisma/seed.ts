// backend/prisma/seed.ts
import { PrismaClient, TransportType, RouteStatus, AlertSeverity, AlertStatus, ReportCategory, ReportStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('DemoPass123!', 12);

  // --- 用户 ---
  const admin = await prisma.user.upsert({
    where: { email: 'admin@transitconnect.demo' },
    update: {},
    create: {
      fullName: 'Demo Admin',
      email: 'admin@transitconnect.demo',
      phone: '+10000000001',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@transitconnect.demo' },
    update: {},
    create: {
      fullName: 'Demo Passenger',
      email: 'user@transitconnect.demo',
      phone: '+10000000002',
      passwordHash,
      role: 'USER',
    },
  });

  // --- 站点（30 个，使用演示城市坐标）---
  const stopData = Array.from({ length: 30 }, (_, i) => ({
    stopName: `Demo Stop ${i + 1}`,
    description: `Demonstration stop ${i + 1}`,
    latitude: 9.005 + (i % 10) * 0.008,
    longitude: 38.760 + Math.floor(i / 10) * 0.01,
    address: `Demo Avenue ${i + 1}`,
  }));

  const stops: any[] = [];
  for (const s of stopData) {
    const stop = await prisma.stop.upsert({
      where: { id: `stop-${s.stopName.replace(/\s/g, '-').toLowerCase()}` },
      update: {},
      create: { id: `stop-${s.stopName.replace(/\s/g, '-').toLowerCase()}`, ...s },
    });
    stops.push(stop);
  }

  // --- 10 条路线 ---
  const routeTemplates = [
    { routeNumber: 'R01', routeName: 'Demo Central Line', startLocation: 'Demo Central', endLocation: 'Demo North', transportType: TransportType.BUS, estimatedDuration: 35, fare: 15 },
    { routeNumber: 'R02', routeName: 'Demo Airport Express', startLocation: 'Demo Central', endLocation: 'Demo Airport', transportType: TransportType.BUS, estimatedDuration: 50, fare: 30 },
    { routeNumber: 'M01', routeName: 'Demo Metro Blue', startLocation: 'Demo East', endLocation: 'Demo West', transportType: TransportType.METRO, estimatedDuration: 25, fare: 20 },
    { routeNumber: 'M02', routeName: 'Demo Metro Green', startLocation: 'Demo South', endLocation: 'Demo North', transportType: TransportType.METRO, estimatedDuration: 30, fare: 20 },
    { routeNumber: 'T01', routeName: 'Demo Tram Riverside', startLocation: 'Demo River', endLocation: 'Demo Market', transportType: TransportType.TRAM, estimatedDuration: 20, fare: 10 },
    { routeNumber: 'B01', routeName: 'Demo Bus Hill Route', startLocation: 'Demo Hill', endLocation: 'Demo Valley', transportType: TransportType.BUS, estimatedDuration: 45, fare: 15 },
    { routeNumber: 'B02', routeName: 'Demo Bus University', startLocation: 'Demo Campus', endLocation: 'Demo Downtown', transportType: TransportType.BUS, estimatedDuration: 40, fare: 15 },
    { routeNumber: 'TR1', routeName: 'Demo Train Suburb', startLocation: 'Demo Suburb', endLocation: 'Demo Central', transportType: TransportType.TRAIN, estimatedDuration: 55, fare: 40 },
    { routeNumber: 'F01', routeName: 'Demo Ferry Lake', startLocation: 'Demo Pier', endLocation: 'Demo Island', transportType: TransportType.FERRY, estimatedDuration: 30, fare: 25 },
    { routeNumber: 'B03', routeName: 'Demo Bus Night', startLocation: 'Demo Central', endLocation: 'Demo South', transportType: TransportType.BUS, estimatedDuration: 38, fare: 15 },
  ];

  const routes: any[] = [];
  for (const r of routeTemplates) {
    const route = await prisma.route.upsert({
      where: { routeNumber: r.routeNumber },
      update: {},
      create: { ...r, description: `${r.routeName} — demonstration data`, status: RouteStatus.ACTIVE },
    });
    routes.push(route);
  }

  // --- RouteStop（每条路线 3–5 个站）---
  for (const route of routes) {
    const count = 3 + (route.routeNumber.length % 3);
    for (let i = 0; i < count; i++) {
      const stop = stops[(routes.indexOf(route) * 3 + i) % stops.length];
      await prisma.routeStop.upsert({
        where: { routeId_stopId: { routeId: route.id, stopId: stop.id } },
        update: {},
        create: { routeId: route.id, stopId: stop.id, stopOrder: i + 1 },
      });
    }
  }

  // --- 示例 Schedule ---
  for (const route of routes) {
    await prisma.schedule.create({
      data: {
        routeId: route.id,
        departureTime: '06:00',
        arrivalTime: '06:45',
        operatingDays: 'MON-FRI',
        frequency: 15,
        scheduleType: 'DEMO',
      },
    }).catch(() => {});
  }

  // --- 示例 Alert ---
  await prisma.serviceAlert.create({
    data: {
      title: 'Demo Service Alert — Route R01',
      description: 'This is demonstration alert data for TransitConnect.',
      severity: AlertSeverity.MEDIUM,
      routeId: routes[0].id,
      startDate: new Date(),
      status: AlertStatus.ACTIVE,
    },
  }).catch(() => {});

  //  Report ---
  await prisma.report.create({
    data: {
      userId: user.id,
      routeId: routes[0].id,
      category: ReportCategory.DELAY,
      description: 'Demonstration report: bus was late.',
      status: ReportStatus.PENDING,
    },
  }).catch(() => {});

  console.log('Seed complete. Admin:', admin.email, '| User:', user.email);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());