import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { getValidPayload } from '@/lib/auth';
import CommentSection from './components/CommentSection';

// Next.js config to revalidate this page occasionally
export const revalidate = 60;

async function getPost(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404 || res.status === 400) return null;
    throw new Error('Failed to fetch post');
  }

  const data = await res.json();
  return data.data;
}

async function getComments(postId) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/post/${postId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return { title: 'Post Not Found — MyStory' };
  }

  return {
    title: `${post.title} — MyStory`,
    description: post.excerpt || 'Read this story on MyStory.',
  };
}

export default async function BlogPostPage({ params }) {
  // Await params first since Next.js 15 treats it as a Promise
  const { id } = await params;
  
  // Fetch post and comments in parallel
  const [post, comments] = await Promise.all([
    getPost(id),
    getComments(id)
  ]);

  if (!post) {
    notFound();
  }

  // Get current user for comment permissions
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const currentUser = token ? getValidPayload(token) : null;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      
      {/* Back Button */}
      <Link href="/blogs" className="inline-block mb-10">
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground -ml-4">
          <ArrowLeft size={16} /> Back to Blogs
        </Button>
      </Link>

      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags?.map(tag => (
            <Badge key={tag} className="bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium border-none px-3 py-1">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-b border-border pb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {post.author?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{post.author?.name || 'Unknown Author'}</p>
              <p className="text-xs">{post.author?.role || 'user'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm ml-auto">
            <span className="flex items-center gap-1.5">
              <Calendar size={16} />
              {new Date(post.createdAt).toLocaleDateString(undefined, { 
                year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={16} />
              {post.readTime || 1} min read
            </span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full h-auto aspect-video rounded-2xl overflow-hidden mb-12 bg-muted shadow-lg">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
        {/* If using a Rich Text Editor later, we might dangerouslySetInnerHTML here. 
            For now, with plain text, we preserve whitespace using pre-wrap */}
        <div className="whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* Comment Section */}
      <CommentSection 
        postId={post._id} 
        postAuthorId={post.author?._id || post.author} 
        initialComments={comments} 
        currentUser={currentUser} 
      />

    </article>
  );
}
