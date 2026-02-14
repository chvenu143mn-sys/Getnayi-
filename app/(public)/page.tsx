'use client';

import { useState, useEffect, useCallback } from 'react';
import { VideoCard } from '@/components/VideoCard';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useVideos } from '@/hooks/useVideos';
import { useWishlist } from '@/hooks/useWishlist';
import { useInView } from '@/hooks/useInView';

export default function FeedPage() {
  const { user } = useAuth();
  const { videos, loading, error, hasMore, loadMore } = useVideos({ pageSize: 5 });
  const { isInWishlist, toggle } = useWishlist(user?.id);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { ref: loadMoreRef, isInView } = useInView<HTMLDivElement>();

  // Handle scroll to update active video index
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const viewportHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / viewportHeight);
    
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < videos.length) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, videos.length]);

  // Load more when user scrolls near bottom
  useEffect(() => {
    if (isInView && hasMore && !loading) {
      loadMore();
    }
  }, [isInView, hasMore, loading, loadMore]);

  return (
    <div 
      className="video-feed no-scrollbar"
      onScroll={handleScroll}
    >
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          isActive={index === activeIndex}
          isLiked={isInWishlist(video.id)}
          onLikeToggle={() => toggle(video.id)}
          onAuthRequired={() => setIsAuthModalOpen(true)}
          userId={user?.id}
        />
      ))}

      {/* Load More Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          {loading && (
            <div className="w-8 h-8 border-4 border-zinc-700 border-t-pink-500 rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* End of Feed */}
      {!hasMore && videos.length > 0 && (
        <div className="h-[50dvh] flex flex-col items-center justify-center px-6 text-center">
          <p className="text-zinc-500 text-lg">You&apos;ve seen it all!</p>
          <p className="text-zinc-600 text-sm mt-2">
            Check back later for more fashion videos
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && videos.length === 0 && (
        <div className="h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-violet-600/20 flex items-center justify-center mb-6">
            <span className="text-4xl font-bold text-pink-500">G</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">No videos yet</h1>
          <p className="text-zinc-500 max-w-sm">
            We&apos;re working on curating the best fashion content for you. Check back soon!
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="h-[50dvh] flex flex-col items-center justify-center px-6 text-center">
          <p className="text-red-500 text-lg">Something went wrong</p>
          <p className="text-zinc-600 text-sm mt-2">{error}</p>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
