import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';

export default function BlogCard({ post }) {
  const {
    slug,
    title,
    excerpt,
    category,
    author,
    readTime,
    date,
    gradient,
  } = post;

  return (
    <article className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
      {/* Cover Image Placeholder */}
      <div className={`h-48 ${gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <span className="text-8xl font-black text-white">{title[0]}</span>
        </div>
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/20 text-white backdrop-blur-sm border-0 hover:bg-white/30">
            {category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          <Link href={`/blogs/${slug}`}>{title}</Link>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white font-semibold text-xs">
              {author[0]}
            </div>
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock size={10} /> {readTime}
            </span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
