export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  productUrl: string;
  productName: string;
  productPrice: number;
  brandName: string;
  brandLogoUrl?: string;
  likes: number;
  views: number;
  clicks: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  videoId: string;
  video: Video;
  createdAt: Date;
}

export interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  productUrl: string;
  productName: string;
  productPrice: number;
  brandName: string;
  brandLogoUrl?: string;
  isPublished: boolean;
}

export interface VideoStats {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  totalClicks: number;
}
