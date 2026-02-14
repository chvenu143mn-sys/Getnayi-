'use client';

import { useState } from 'react';
import { Heart, ExternalLink, Bookmark } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { useInView } from '@/hooks/useInView';
import { incrementVideoViews, incrementVideoClicks } from '@/lib/firestore';
import { formatNumber, formatPrice } from '@/lib/utils';
import type { Video } from '@/types';

interface VideoCardProps {
  video: Video;
  isActive: boolean;
  isLiked: boolean;
  onLikeToggle: () => void;
  onAuthRequired: () => void;
  userId: string | undefined;
}

export function VideoCard({
  video,
  isActive,
  isLiked,
  onLikeToggle,
  onAuthRequired,
  userId,
}: VideoCardProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.6 });
  const [hasViewed, setHasViewed] = useState(false);

  const handleView = async () => {
    if (!hasViewed) {
      setHasViewed(true);
      await incrementVideoViews(video.id);
    }
  };

  const handleProductClick = async () => {
    if (!userId) {
      onAuthRequired();
      return;
    }
    
    await incrementVideoClicks(video.id);
    window.open(video.productUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLikeClick = () => {
    if (!userId) {
      onAuthRequired();
      return;
    }
    onLikeToggle();
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-[100dvh] snap-start snap-always"
    >
      {/* Video Player */}
      <VideoPlayer
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        isActive={isActive && isInView}
        onView={handleView}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
        {/* Like Button */}
        <button
          onClick={handleLikeClick}
          className="flex flex-col items-center gap-1 group"
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <div className={`
            p-3 rounded-full transition-all duration-200
            ${isLiked 
              ? 'bg-red-500 text-white' 
              : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
            }
          `}>
            <Heart 
              className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} 
            />
          </div>
          <span className="text-white text-sm font-medium">
            {formatNumber(video.likes + (isLiked ? 1 : 0) - (video.likes > 0 && isLiked ? 0 : 0))}
          </span>
        </button>

        {/* Visit Product Button */}
        <button
          onClick={handleProductClick}
          className="flex flex-col items-center gap-1 group"
          aria-label="Visit product"
        >
          <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200">
            <ExternalLink className="w-6 h-6" />
          </div>
          <span className="text-white text-sm font-medium">
            {formatNumber(video.clicks)}
          </span>
        </button>
      </div>

      {/* Bottom Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-24">
        <div className="flex items-start gap-3">
          {/* Brand Logo */}
          {video.brandLogoUrl && (
            <img
              src={video.brandLogoUrl}
              alt={video.brandName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/20 flex-shrink-0"
            />
          )}
          
          <div className="flex-1 min-w-0">
            {/* Brand Name */}
            <p className="text-white/80 text-sm font-medium mb-1">
              {video.brandName}
            </p>
            
            {/* Product Name */}
            <h3 className="text-white font-semibold text-lg leading-tight mb-1 line-clamp-2">
              {video.productName}
            </h3>
            
            {/* Price */}
            <p className="text-white font-bold text-xl">
              {formatPrice(video.productPrice)}
            </p>
            
            {/* Description */}
            {video.description && (
              <p className="text-white/70 text-sm mt-2 line-clamp-2">
                {video.description}
              </p>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleProductClick}
          className="mt-4 w-full py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
        >
          <span>Shop Now</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Views Counter */}
      <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
        <span className="text-white text-sm font-medium">
          {formatNumber(video.views + (hasViewed ? 1 : 0))} views
        </span>
      </div>
    </div>
  );
}
