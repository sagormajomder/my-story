import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Calendar, Clock, User } from 'lucide-react';

export const metadata = {
  title: 'Blogs — MyStory',
  description: 'Read the latest stories and thoughts from our community.',
};

// Next.js config to revalidate this page occasionally or fetch dynamically
export const revalidate = 60; // Revalidate every 60 seconds (ISR)

async function getBlogs() {
  // Call the backend directly from the Server Component
  // process.env.NEXT_PUBLIC_API_URL ensures it connects properly (usually http://localhost:5000/api/v1)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blogs');
  }

  return res.json();
}

export default async function BlogsPage() {
  let posts = [];
  try {
    const data = await getBlogs();
    posts = data.data || [];
  } catch (error) {
    console.error(error);
    // In a real app, you might render an error state component here
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Discover Stories</h1>
        <p className="text-lg text-muted-foreground">
          Explore the latest thoughts, experiences, and tutorials from the MyStory community.
        </p>
      </div>

      {/* Blogs Grid */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-semibold mb-2">No stories found</h3>
          <p className="text-muted-foreground">Check back later for new content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post._id} href={`/blogs/${post._id}`} className="group h-full">
              <Card className="h-full border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
                {post.coverImage && (
                  <div className="w-full h-48 overflow-hidden bg-muted">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-1">
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.length > 0 ? (
                      post.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">Story</Badge>
                    )}
                  </div>

                  {/* Title & Excerpt */}
                  <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {post.excerpt || post.content.replace(/(<([^>]+)>)/gi, '')}
                  </p>

                  {/* Meta info (Author, Date, Read Time) */}
                  <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span className="font-medium truncate max-w-[100px]">{post.author?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime || 1} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
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
  );
}
