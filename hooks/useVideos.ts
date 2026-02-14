'use client';

import { useState, useEffect, useCallback } from 'react';
import { DocumentSnapshot } from 'firebase/firestore';
import { getPublishedVideos, getAllVideos } from '@/lib/firestore';
import type { Video } from '@/types';

interface UseVideosOptions {
  isAdmin?: boolean;
  pageSize?: number;
}

export function useVideos({ isAdmin = false, pageSize = 10 }: UseVideosOptions = {}) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);

  const fetchVideos = useCallback(async (isInitial: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentLastDoc = isInitial ? undefined : lastDoc || undefined;
      const result = isAdmin
        ? await getAllVideos(currentLastDoc, pageSize)
        : await getPublishedVideos(currentLastDoc, pageSize);

      if (isInitial) {
        setVideos(result.videos);
      } else {
        setVideos((prev) => [...prev, ...result.videos]);
      }

      setLastDoc(result.lastDoc);
      setHasMore(result.videos.length === pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, pageSize, lastDoc]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchVideos(false);
    }
  }, [loading, hasMore, fetchVideos]);

  const refresh = useCallback(() => {
    setLastDoc(null);
    setHasMore(true);
    fetchVideos(true);
  }, [fetchVideos]);

  useEffect(() => {
    fetchVideos(true);
  }, []);

  return {
    videos,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
