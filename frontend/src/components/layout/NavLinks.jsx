import Link from 'next/link';

// Server Component — purely static nav links
export default function NavLinks({ isLoggedIn }) {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/blogs', label: 'Blogs' },
    ...(isLoggedIn ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <nav className="hidden md:flex items-center gap-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
