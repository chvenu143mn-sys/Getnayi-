'use client';

import { useEffect, useState } from 'react';
import { Video, Eye, Heart, MousePointerClick, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getVideoStats, getAllVideos } from '@/lib/firestore';
import { formatNumber } from '@/lib/utils';
import type { Video as VideoType, VideoStats } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<VideoStats>({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalClicks: 0,
  });
  const [recentVideos, setRecentVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [videoStats, { videos }] = await Promise.all([
          getVideoStats(),
          getAllVideos(undefined, 5),
        ]);
        setStats(videoStats);
        setRecentVideos(videos);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Videos', value: stats.totalVideos, icon: Video, color: 'bg-blue-500' },
    { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'bg-green-500' },
    { label: 'Total Likes', value: stats.totalLikes, icon: Heart, color: 'bg-pink-500' },
    { label: 'Total Clicks', value: stats.totalClicks, icon: MousePointerClick, color: 'bg-violet-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Overview of your video content and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-zinc-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {loading ? '-' : formatNumber(stat.value)}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Videos */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Videos</h2>
          <Link
            href="/admin/videos"
            className="text-pink-500 hover:text-pink-400 text-sm font-medium"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-zinc-900 rounded-xl overflow-hidden">
                <div className="aspect-video bg-zinc-800 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : recentVideos.length === 0 ? (
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
              <span>Upload Video</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVideos.map((video) => (
              <Link
                key={video.id}
                href={`/admin/videos/${video.id}`}
                className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/50 hover:border-zinc-700 transition-colors"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {!video.isPublished && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500/90 text-black text-xs font-semibold rounded">
                      Draft
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold truncate">{video.title}</h3>
                  <p className="text-zinc-500 text-sm mt-1">{video.brandName}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatNumber(video.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {formatNumber(video.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MousePointerClick className="w-3 h-3" />
                      {formatNumber(video.clicks)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
