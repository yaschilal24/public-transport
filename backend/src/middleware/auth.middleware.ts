import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../database/prisma';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string; role: string; email: string };
    const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, role: true, email: true } });
    if (!user) return res.status(401).json({ success: false, message: 'User no longer exists' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
  };
}