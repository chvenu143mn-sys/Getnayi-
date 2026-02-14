'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createVideo, updateVideo } from '@/lib/firestore';
import type { VideoFormData, Video } from '@/types';

interface VideoFormProps {
  initialData?: Video;
  isEdit?: boolean;
}

const initialFormData: VideoFormData = {
  title: '',
  description: '',
  videoUrl: '',
  thumbnailUrl: '',
  productUrl: '',
  productName: '',
  productPrice: 0,
  brandName: '',
  brandLogoUrl: '',
  isPublished: false,
};

export function VideoForm({ initialData, isEdit = false }: VideoFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<VideoFormData>(
    initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          videoUrl: initialData.videoUrl,
          thumbnailUrl: initialData.thumbnailUrl,
          productUrl: initialData.productUrl,
          productName: initialData.productName,
          productPrice: initialData.productPrice,
          brandName: initialData.brandName,
          brandLogoUrl: initialData.brandLogoUrl || '',
          isPublished: initialData.isPublished,
        }
      : initialFormData
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be signed in');
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.videoUrl.trim()) {
      toast.error('Video URL is required');
      return;
    }
    if (!formData.productUrl.trim()) {
      toast.error('Product URL is required');
      return;
    }
    if (!formData.productName.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.brandName.trim()) {
      toast.error('Brand name is required');
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEdit && initialData) {
        await updateVideo(initialData.id, formData);
        toast.success('Video updated successfully');
      } else {
        await createVideo(formData, user.id);
        toast.success('Video created successfully');
      }

      router.push('/admin/videos');
      router.refresh();
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter video title"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Enter video description"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Video URL */}
      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-zinc-300 mb-2">
          Video URL (Bunny CDN) <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          id="videoUrl"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleChange}
          placeholder="https://yourzone.b-cdn.net/video.mp4"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Enter the direct MP4 URL from Bunny CDN
        </p>
      </div>

      {/* Thumbnail URL */}
      <div>
        <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-zinc-300 mb-2">
          Thumbnail URL
        </label>
        <input
          type="url"
          id="thumbnailUrl"
          name="thumbnailUrl"
          value={formData.thumbnailUrl}
          onChange={handleChange}
          placeholder="https://yourzone.b-cdn.net/thumbnail.jpg"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      {/* Product Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-zinc-300 mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Product name"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="productPrice" className="block text-sm font-medium text-zinc-300 mb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="productPrice"
            name="productPrice"
            value={formData.productPrice}
            onChange={handleNumberChange}
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Product URL */}
      <div>
        <label htmlFor="productUrl" className="block text-sm font-medium text-zinc-300 mb-2">
          Product URL <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          id="productUrl"
          name="productUrl"
          value={formData.productUrl}
          onChange={handleChange}
          placeholder="https://brand.com/product"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      {/* Brand Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brandName" className="block text-sm font-medium text-zinc-300 mb-2">
            Brand Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            placeholder="Brand name"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="brandLogoUrl" className="block text-sm font-medium text-zinc-300 mb-2">
            Brand Logo URL
          </label>
          <input
            type="url"
            id="brandLogoUrl"
            name="brandLogoUrl"
            value={formData.brandLogoUrl}
            onChange={handleChange}
            placeholder="https://brand.com/logo.png"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Published Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPublished"
          name="isPublished"
          checked={formData.isPublished}
          onChange={handleChange}
          className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-pink-500 focus:ring-pink-500 focus:ring-offset-zinc-900"
        />
        <label htmlFor="isPublished" className="text-sm font-medium text-zinc-300">
          Publish video (visible to public)
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.push('/admin/videos')}
          className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{isEdit ? 'Update Video' : 'Create Video'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
