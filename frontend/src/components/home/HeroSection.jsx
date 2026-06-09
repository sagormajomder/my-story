import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, PenLine } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Gradient blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Welcome to MyStory Platform
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6">
          Share Your{' '}
          <span className="gradient-text">Story</span>
          <br />
          with the World
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
          A modern platform for writers and readers. Discover inspiring stories,
          share your thoughts, and connect with a passionate community of storytellers.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
            <Link href="/blogs">
              Start Reading
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-12 px-8 border-border hover:bg-accent transition-all">
            <Link href="/register">
              <PenLine size={16} className="mr-2" />
              Start Writing
            </Link>
          </Button>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-foreground">500+</span> Stories
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="flex items-center gap-1">
            <span className="font-semibold text-foreground">200+</span> Writers
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="flex items-center gap-1">
            <span className="font-semibold text-foreground">10k+</span> Readers
          </span>
        </div>
      </div>
    </section>
  );
}
