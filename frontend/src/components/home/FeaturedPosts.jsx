import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BookOpen, Calendar, Clock, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

async function getLatestPosts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts?limit=6`,
      {
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch latest posts:', error);
    return [];
  }
}

export default async function FeaturedPosts() {
  const posts = await getLatestPosts();

  return (
    <section className='py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10'>
          <div>
            <h2 className='text-3xl font-bold mb-2'>
              Latest <span className='gradient-text'>Stories</span>
            </h2>
            <p className='text-muted-foreground'>
              The newest stories from our talented community of writers
            </p>
          </div>
          <Button variant='outline' asChild className='shrink-0'>
            <Link href='/blogs'>
              View all blogs
              <ArrowRight size={14} className='ml-2' />
            </Link>
          </Button>
        </div>

        {/* Blog Grid */}
        {posts.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-10 text-center'>
            <BookOpen className='w-12 h-12 text-muted-foreground mb-4 opacity-20' />
            <h3 className='text-lg font-semibold mb-2'>No stories found</h3>
            <p className='text-muted-foreground'>
              Check back later for new content.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {posts.map(post => (
              <Link
                key={post._id}
                href={`/blogs/${post._id}`}
                className='group h-full'>
                <Card className='h-full p-0 border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden'>
                  {post.coverImage && (
                    <div className='w-full h-48 overflow-hidden bg-muted relative'>
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        loading='eager'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        className='object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                    </div>
                  )}
                  <CardContent className='p-6 flex flex-col flex-1'>
                    {/* Tags */}
                    <div className='flex flex-wrap gap-2 mb-4'>
                      {post.tags?.length > 0 ? (
                        post.tags.slice(0, 3).map(tag => (
                          <Badge
                            key={tag}
                            variant='secondary'
                            className='bg-primary/5 text-primary hover:bg-primary/10 transition-colors'>
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <Badge
                          variant='secondary'
                          className='bg-muted text-muted-foreground'>
                          Story
                        </Badge>
                      )}
                    </div>

                    {/* Title & Excerpt */}
                    <h2 className='text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors'>
                      {post.title}
                    </h2>
                    <p className='text-muted-foreground line-clamp-3 mb-6 flex-1'>
                      {post.excerpt ||
                        post.content.replace(/(<([^>]+)>)/gi, '')}
                    </p>

                    {/* Meta info */}
                    <div className='mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground'>
                      <div className='flex items-center gap-2'>
                        <User size={14} />
                        <span className='font-medium truncate max-w-[100px]'>
                          {post.author?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className='flex items-center gap-3'>
                        <span className='flex items-center gap-1'>
                          <Clock size={14} />
                          {post.readTime || 1} min
                        </span>
                        <span className='flex items-center gap-1'>
                          <Calendar size={14} />
                          {new Date(post.createdAt).toLocaleDateString(
                            undefined,
                            { month: 'short', day: 'numeric' },
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
