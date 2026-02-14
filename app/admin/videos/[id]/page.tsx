'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { VideoForm } from '@/components/VideoForm';
import { getVideo } from '@/lib/firestore';
import type { Video } from '@/types';

export default function EditVideoPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideo() {
      try {
        const videoId = params.id as string;
        const videoData = await getVideo(videoId);
        
        if (!videoData) {
          setError('Video not found');
          return;
        }
        
        setVideo(videoData);
      } catch (err) {
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    }

    loadVideo();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-zinc-800 rounded w-48 animate-pulse" />
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800/50 space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-zinc-800 rounded w-24 animate-pulse" />
              <div className="h-12 bg-zinc-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push('/admin/videos')}
          className="mt-4 text-pink-500 hover:text-pink-400"
        >
          Back to videos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Edit Video</h1>
        <p className="text-zinc-500 mt-1">Update video details and settings</p>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800/50">
        {video && <VideoForm initialData={video} isEdit />}
      </div>
    </div>
  );
}
