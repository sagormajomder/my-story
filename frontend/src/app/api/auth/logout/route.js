import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  // Notify the backend (fire-and-forget — don't block if backend is down)
  if (token) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {}
  }

  // Clear the httpOnly cookie — this is what actually logs the user out
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 },
  );

  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
