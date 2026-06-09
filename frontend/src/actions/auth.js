'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function loginAction(data) {
  try {
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );

    const result = await backendRes.json();

    if (!backendRes.ok) {
      return { success: false, message: result.message || 'Login failed. Please try again.' };
    }

    // Set httpOnly cookie 
    const cookieStore = await cookies();
    cookieStore.set('auth_token', result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return { success: true, data: { user: result.data.user } };
  } catch (error) {
    console.error('Login action error:', error);
    return { success: false, message: 'Internal server error' };
  }
}

export async function registerAction(data) {
  try {
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );

    const result = await backendRes.json();

    if (!backendRes.ok) {
      return { success: false, message: result.message || 'Registration failed. Please try again.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Register action error:', error);
    return { success: false, message: 'Internal server error' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  revalidatePath('/', 'layout');
  return { success: true };
}
