import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturedPosts from '@/components/home/FeaturedPosts';

export const metadata = {
  title: 'MyStory — Share Your Story with the World',
  description:
    'Discover inspiring stories from writers around the world. Join MyStory to read, write, and connect with a passionate community.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedPosts />
    </>
  );
}
