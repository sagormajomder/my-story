import Link from 'next/link';
import { cookies } from 'next/headers';
import { BookOpen } from 'lucide-react';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';
import { getValidPayload } from '@/lib/auth';

// Server Component — reads cookie server-side
export default async function Header() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  let user = null;
  if (token) {
    user = getValidPayload(token);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
              <BookOpen size={16} />
            </div>
            <span className="gradient-text">MyStory</span>
          </Link>

          {/* Nav Links */}
          <NavLinks isLoggedIn={!!user} />

          {/* Auth Buttons (Client) */}
          <AuthButtons user={user} />
        </div>
      </div>
    </header>
  );
}
