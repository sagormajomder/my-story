import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import BlogCard from './BlogCard';

// Placeholder blog data — replace with real API call when posts API is ready
const SAMPLE_POSTS = [
  {
    slug: 'the-art-of-storytelling',
    title: 'The Art of Storytelling in the Digital Age',
    excerpt: 'How modern writers are adapting ancient storytelling techniques to captivate audiences in an era of short attention spans.',
    category: 'Writing',
    author: 'Sarah Chen',
    readTime: '5 min read',
    date: 'Jun 8, 2026',
    gradient: 'bg-gradient-to-br from-violet-500 to-purple-700',
  },
  {
    slug: 'mindfulness-remote-work',
    title: 'Mindfulness Practices for Remote Workers',
    excerpt: 'Practical techniques to maintain focus, reduce stress, and build healthy boundaries when your home becomes your office.',
    category: 'Wellness',
    author: 'Alex Rivera',
    readTime: '7 min read',
    date: 'Jun 7, 2026',
    gradient: 'bg-gradient-to-br from-emerald-400 to-teal-600',
  },
  {
    slug: 'future-of-ai',
    title: 'The Future of AI in Creative Industries',
    excerpt: 'Exploring how artificial intelligence is reshaping the landscape of art, music, writing, and design.',
    category: 'Technology',
    author: 'Marcus Lee',
    readTime: '8 min read',
    date: 'Jun 6, 2026',
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-700',
  },
  {
    slug: 'solo-travel-guide',
    title: 'The Definitive Solo Travel Guide for 2026',
    excerpt: 'Everything you need to know about planning, budgeting, and staying safe while exploring the world on your own terms.',
    category: 'Travel',
    author: 'Priya Patel',
    readTime: '10 min read',
    date: 'Jun 5, 2026',
    gradient: 'bg-gradient-to-br from-orange-400 to-rose-600',
  },
  {
    slug: 'cooking-for-one',
    title: 'Cooking for One: Joyful Meals Without the Waste',
    excerpt: 'Simple recipes and smart strategies that make cooking solo a delightful, sustainable experience.',
    category: 'Food',
    author: 'Jamie Donovan',
    readTime: '6 min read',
    date: 'Jun 4, 2026',
    gradient: 'bg-gradient-to-br from-yellow-400 to-amber-600',
  },
  {
    slug: 'learning-new-skills',
    title: 'How to Learn Any New Skill in 30 Days',
    excerpt: 'A science-backed framework for rapid skill acquisition that anyone can apply to accelerate their personal growth.',
    category: 'Personal Growth',
    author: 'Jordan Kim',
    readTime: '9 min read',
    date: 'Jun 3, 2026',
    gradient: 'bg-gradient-to-br from-pink-400 to-fuchsia-600',
  },
];

export default function FeaturedPosts() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Featured <span className="gradient-text">Stories</span>
            </h2>
            <p className="text-muted-foreground">
              Hand-picked stories from our talented community of writers
            </p>
          </div>
          <Button variant="outline" asChild className="shrink-0">
            <Link href="/blogs">
              View all blogs
              <ArrowRight size={14} className="ml-2" />
            </Link>
          </Button>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_POSTS.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
