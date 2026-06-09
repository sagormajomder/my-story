'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function fetchFromBackend(endpoint, method, body) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || 'Action failed', errors: data.errors };
    }

    // Immediately revalidate the caches
    revalidatePath('/', 'layout');
    revalidatePath('/blogs', 'layout');
    revalidatePath('/dashboard', 'layout');

    return { success: true, data: data.data };
  } catch (error) {
    console.error(`Server Action Error [${method} ${endpoint}]:`, error);
    return { success: false, message: 'Internal server error' };
  }
}

export async function createPostAction(postData) {
  return fetchFromBackend('/posts', 'POST', postData);
}

export async function updatePostAction(id, postData) {
  return fetchFromBackend(`/posts/${id}`, 'PATCH', postData);
}

export async function deletePostAction(id) {
  return fetchFromBackend(`/posts/${id}`, 'DELETE');
}
