'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUserWishlist, toggleWishlist, isInWishlist as checkIsInWishlist, getUserWishlistCount } from '@/lib/firestore';
import type { Wishlist } from '@/types';

export function useWishlist(userId: string | undefined) {
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [wishlistVideoIds, setWishlistVideoIds] = useState<Set<string>>(new Set());
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    if (!userId) {
      setWishlist([]);
      setWishlistVideoIds(new Set());
      setCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [items, itemCount] = await Promise.all([
        getUserWishlist(userId),
        getUserWishlistCount(userId),
      ]);
      
      setWishlist(items);
      setWishlistVideoIds(new Set(items.map((item) => item.videoId)));
      setCount(itemCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const toggle = useCallback(async (videoId: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      const isAdded = await toggleWishlist(userId, videoId);
      
      // Optimistically update the UI
      if (isAdded) {
        setWishlistVideoIds((prev) => {
          const newSet = new Set(prev);
          newSet.add(videoId);
          return newSet;
        });
        setCount((prev) => prev + 1);
      } else {
        setWishlistVideoIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });
        setCount((prev) => prev - 1);
        setWishlist((prev) => prev.filter((item) => item.videoId !== videoId));
      }
      
      return isAdded;
    } catch (err) {
      throw err;
    }
  }, [userId]);

  const checkWishlistStatus = useCallback(async (videoId: string): Promise<boolean> => {
    if (!userId) return false;
    return checkIsInWishlist(userId, videoId);
  }, [userId]);

  const isInWishlist = useCallback((videoId: string): boolean => {
    return wishlistVideoIds.has(videoId);
  }, [wishlistVideoIds]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return {
    wishlist,
    count,
    loading,
    error,
    toggle,
    isInWishlist,
    checkWishlistStatus,
    refresh: fetchWishlist,
  };
}
