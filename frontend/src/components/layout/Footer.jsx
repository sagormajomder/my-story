import Link from 'next/link';
import { BookOpen, X, Globe, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Platform: [
      { label: 'Home', href: '/' },
      { label: 'Blogs', href: '/blogs' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
    Account: [
      { label: 'Login', href: '/login' },
      { label: 'Sign Up', href: '/register' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <BookOpen size={16} />
              </div>
              <span className="gradient-text">MyStory</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A modern blog platform where readers and writers connect to share ideas and inspire each other.
            </p>
            <div className="flex items-center gap-3 mt-4">
            {[X, Globe, ExternalLink].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 text-muted-foreground"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>© {currentYear} MyStory. All rights reserved.</p>
          <p>Built with ❤️ using Next.js & TailwindCSS</p>
        </div>
      </div>
    </footer>
  );
}
