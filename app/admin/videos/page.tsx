'use client';

import { useState } from 'react';
import { Video, Plus, Eye, Heart, MousePointerClick, MoreVertical, Trash2, Edit, Globe, EyeOff } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useVideos } from '@/hooks/useVideos';
import { updateVideo, deleteVideo } from '@/lib/firestore';
import { formatNumber, formatPrice } from '@/lib/utils';

export default function VideosPage() {
  const { videos, loading, error, hasMore, loadMore, refresh } = useVideos({
    isAdmin: true,
    pageSize: 10,
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleTogglePublish = async (videoId: string, currentStatus: boolean) => {
    try {
      setUpdatingId(videoId);
      await updateVideo(videoId, { isPublished: !currentStatus });
      toast.success(currentStatus ? 'Video unpublished' : 'Video published');
      refresh();
    } catch (error) {
      toast.error('Failed to update video');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(videoId);
      await deleteVideo(videoId);
      toast.success('Video deleted');
      refresh();
    } catch (error) {
      toast.error('Failed to delete video');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Videos</h1>
          <p className="text-zinc-500 mt-1">Manage your video content</p>
        </div>
        <Link
          href="/admin/videos/upload"
          className="flex items-center gap-2 px-4 py-2.5 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Upload Video</span>
        </Link>
      </div>

      {/* Videos List */}
      {loading && videos.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-xl p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-32 h-20 bg-zinc-800 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded w-1/3" />
                  <div className="h-3 bg-zinc-800 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load videos</p>
          <button onClick={refresh} className="mt-4 text-pink-500 hover:text-pink-400">
            Try again
          </button>
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl p-12 text-center border border-zinc-800/50">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No videos yet</h3>
          <p className="text-zinc-500 mb-6">Upload your first video to get started</p>
          <Link
            href="/admin/videos/upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Video</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-zinc-900 rounded-xl border border-zinc-800/50 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Thumbnail */}
                <div className="relative w-full md:w-48 aspect-video md:aspect-square flex-shrink-0">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  {!video.isPublished && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500/90 text-black text-xs font-semibold rounded">
                      Draft
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{video.title}</h3>
                      <p className="text-zinc-500 text-sm mt-1">
                        {video.brandName} • {formatPrice(video.productPrice)}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mt-3 text-sm text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatNumber(video.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {formatNumber(video.likes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointerClick className="w-4 h-4" />
                          {formatNumber(video.clicks)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(video.id, video.isPublished)}
                        disabled={updatingId === video.id}
                        className={`p-2 rounded-lg transition-colors ${
                          video.isPublished
                            ? 'text-green-500 hover:bg-green-500/10'
                            : 'text-zinc-500 hover:bg-zinc-800'
                        }`}
                        title={video.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {video.isPublished ? (
                          <Globe className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>

                      <Link
                        href={`/admin/videos/${video.id}`}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>

                      <button
                        onClick={() => handleDelete(video.id)}
                        disabled={deletingId === video.id}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center py-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
