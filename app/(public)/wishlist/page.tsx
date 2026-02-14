'use client';

import { useEffect } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import { AuthModal } from '@/components/AuthModal';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { wishlist, loading, error, refresh } = useWishlist(user?.id);

  // Refresh wishlist when user changes
  useEffect(() => {
    if (user) {
      refresh();
    }
  }, [user, refresh]);

  // Show auth modal for non-authenticated users
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6">
        <AuthModal
          isOpen={true}
          onClose={() => {}}
          title="Sign in to view your wishlist"
          description="Save your favorite fashion items and shop them later."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800/50 px-4 py-4">
        <h1 className="text-xl font-bold text-white">My Wishlist</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          // Loading Skeleton
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-zinc-900 rounded-xl overflow-hidden">
                <div className="aspect-[3/4] bg-zinc-800 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-3 bg-zinc-800 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error State
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load wishlist</p>
            <button
              onClick={refresh}
              className="mt-4 text-pink-500 hover:text-pink-400"
            >
              Try again
            </button>
          </div>
        ) : wishlist.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-zinc-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-zinc-500 max-w-xs mb-8">
              Start exploring and save your favorite fashion items to your wishlist
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors"
            >
              <span>Explore Feed</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          // Wishlist Grid
          <div className="grid grid-cols-2 gap-4">
            {wishlist.map((item) => (
              <a
                key={item.id}
                href={item.video.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/50 hover:border-zinc-700 transition-colors"
              >
                {/* Thumbnail */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={item.video.thumbnailUrl}
                    alt={item.video.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Brand Logo */}
                  {item.video.brandLogoUrl && (
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm p-1">
                      <img
                        src={item.video.brandLogoUrl}
                        alt={item.video.brandName}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-zinc-500 text-xs mb-1">
                    {item.video.brandName}
                  </p>
                  <h3 className="text-white font-medium text-sm line-clamp-2 mb-2">
                    {item.video.productName}
                  </h3>
                  <p className="text-pink-500 font-bold">
                    {formatPrice(item.video.productPrice)}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
