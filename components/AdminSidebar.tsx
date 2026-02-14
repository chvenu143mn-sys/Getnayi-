'use client';

import { LayoutDashboard, Video, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/videos', icon: Video, label: 'Videos' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center">
            <span className="text-xl font-bold text-white">G</span>
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">GetNayi</h1>
            <p className="text-zinc-500 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                    isActive
                      ? 'bg-pink-500/10 text-pink-500'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 mb-4">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-400 font-medium">
                {user?.displayName?.[0] || user?.email?.[0] || 'U'}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">
              {user?.displayName || 'Admin'}
            </p>
            <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
