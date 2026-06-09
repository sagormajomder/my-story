'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu';

// Client Component — renders login/signup buttons or user avatar
export default function AuthButtons({ user }) {
  if (user) {
    return <UserMenu user={user} />;
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">Login</Link>
      </Button>
      <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
        <Link href="/register">Sign Up</Link>
      </Button>
    </div>
  );
}
