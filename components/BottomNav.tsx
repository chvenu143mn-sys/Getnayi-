'use client';

import { Home, Heart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Feed' },
  { href: '/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-800/50">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition-colors',
                isActive
                  ? 'text-pink-500'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <Icon className={cn('w-6 h-6', isActive && 'fill-current')} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
