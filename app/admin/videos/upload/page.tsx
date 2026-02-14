'use client';

import { VideoForm } from '@/components/VideoForm';

export default function UploadVideoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Upload Video</h1>
        <p className="text-zinc-500 mt-1">Add a new video to your collection</p>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800/50">
        <VideoForm />
      </div>
    </div>
  );
}
