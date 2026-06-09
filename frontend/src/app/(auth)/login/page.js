import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Sign In — MyStory',
  description: 'Sign in to your MyStory account to access your dashboard and manage your stories.',
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-400/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-400/15 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <BookOpen size={16} />
            </div>
            <span className="gradient-text">MyStory</span>
          </Link>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
