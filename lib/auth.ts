import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { validateSession } from './database';

export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get('admin_session')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const session = await validateSession(token);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
