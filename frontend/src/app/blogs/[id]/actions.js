'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createCommentAction(postId, content) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return { success: false, message: 'Unauthorized. Please log in to comment.' };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ post: postId, content }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || 'Failed to post comment' };
    }

    revalidatePath(`/blogs/${postId}`);
    revalidatePath('/dashboard', 'layout'); // Refresh stats on dashboard

    return { success: true, data: data.data };
  } catch (error) {
    console.error('Create Comment Error:', error);
    return { success: false, message: 'Internal server error' };
  }
}

export async function deleteCommentAction(commentId, postId) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to delete comment' };
    }

    revalidatePath(`/blogs/${postId}`);
    revalidatePath('/dashboard', 'layout');

    return { success: true };
  } catch (error) {
    console.error('Delete Comment Error:', error);
    return { success: false, message: 'Internal server error' };
  }
}
