import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decodeToken } from '@/lib/auth';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const payload = decodeToken(token);

  if (!payload || Date.now() >= payload.exp * 1000) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user: payload }, { status: 200 });
}
