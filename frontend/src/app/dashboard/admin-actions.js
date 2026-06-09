'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function fetchFromAdminAPI(endpoint, method = 'GET', body = undefined) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return { success: false, message: 'Unauthorized' };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Action failed' };

    return { success: true, data: data.data || data };
  } catch (error) {
    console.error('Admin API Error:', error);
    return { success: false, message: 'Internal server error' };
  }
}

export async function changeUserRoleAction(userId, role) {
  const res = await fetchFromAdminAPI(`/users/${userId}/role`, 'PATCH', { role });
  if (res.success) revalidatePath('/dashboard', 'layout');
  return res;
}

export async function deleteUserAction(userId) {
  const res = await fetchFromAdminAPI(`/users/${userId}`, 'DELETE');
  if (res.success) revalidatePath('/dashboard', 'layout');
  return res;
}

// We can reuse the post delete and comment delete actions, but if they are bound to different routes, 
// let's use the ones in `actions.js` or `blogs/[id]/actions.js`. Wait, admin can just call the public `DELETE /posts/:id` since their token has the `super_admin` role. 
// However, to keep it clean, let's proxy the post/comment deletes here directly using the standard endpoints.

export async function deleteAnyPostAction(postId) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.ok) {
    revalidatePath('/dashboard', 'layout');
    revalidatePath('/blogs', 'layout');
    return { success: true };
  }
  return { success: false, message: 'Failed to delete post' };
}

export async function deleteAnyCommentAction(commentId) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.ok) {
    revalidatePath('/dashboard', 'layout');
    return { success: true };
  }
  return { success: false, message: 'Failed to delete comment' };
}
