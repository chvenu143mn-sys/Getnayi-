'use client';

import { useEffect, useState } from 'react';
import { Heart, ExternalLink, Settings, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { getUserWishlistCount } from '@/lib/firestore';

export default function ProfilePage() {
  const { user, loading: authLoading, logout, isAdmin } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      getUserWishlistCount(user.id).then(setWishlistCount);
    }
  }, [user?.id]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-700 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-violet-600/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-pink-500">G</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to GetNayi</h1>
          <p className="text-zinc-500 mb-8 max-w-xs mx-auto">
            Sign in to save items, track your activity, and personalize your experience
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Sign In
          </button>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Profile Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-20 h-20 rounded-full object-cover border-2 border-pink-500/30"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white">
              {user.displayName?.[0] || user.email?.[0] || 'U'}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              {user.displayName || 'User'}
            </h1>
            <p className="text-zinc-500">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-6">
          <Link href="/wishlist" className="flex-1 bg-zinc-900 rounded-xl p-4 border border-zinc-800/50">
            <div className="flex items-center gap-2 text-pink-500 mb-1">
              <Heart className="w-5 h-5 fill-current" />
              <span className="text-2xl font-bold">{wishlistCount}</span>
            </div>
            <p className="text-zinc-500 text-sm">Wishlist</p>
          </Link>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 space-y-2">
        {/* Wishlist Link */}
        <Link
          href="/wishlist"
          className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-500" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">My Wishlist</p>
            <p className="text-zinc-500 text-sm">{wishlistCount} items saved</p>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-500" />
        </Link>

        {/* Admin Link */}
        {isAdmin && (
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-violet-500" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Admin Panel</p>
              <p className="text-zinc-500 text-sm">Manage videos and analytics</p>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </Link>
        )}
      </div>

      {/* Sign Out */}
      <div className="px-4 mt-8">
        <button
          onClick={logout}
          className="w-full py-4 px-4 bg-zinc-900 text-red-500 font-medium rounded-xl border border-zinc-800/50 hover:border-red-500/30 hover:bg-red-500/10 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 mt-12 text-center">
        <p className="text-zinc-600 text-sm">
          GetNayi v1.0
        </p>
      </div>
    </div>
  );
}
