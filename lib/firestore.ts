import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  increment,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, Video, Wishlist, VideoFormData, VideoStats } from '@/types';

const USERS_COLLECTION = 'users';
const VIDEOS_COLLECTION = 'videos';
const WISHLISTS_COLLECTION = 'wishlists';

// User Operations
export async function createUser(userId: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const now = serverTimestamp();
  await setDoc(userRef, {
    ...userData,
    role: 'user',
    createdAt: now,
    updatedAt: now,
  });
}

export async function getUser(userId: string): Promise<User | null> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;
  const data = userSnap.data();
  return {
    id: userSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as User;
}

export async function updateUser(userId: string, userData: Partial<User>) {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, {
    ...userData,
    updatedAt: serverTimestamp(),
  });
}

// Video Operations
export async function createVideo(videoData: VideoFormData, userId: string): Promise<string> {
  const videosRef = collection(db, VIDEOS_COLLECTION);
  const newVideoRef = doc(videosRef);
  const now = serverTimestamp();
  
  await setDoc(newVideoRef, {
    ...videoData,
    likes: 0,
    views: 0,
    clicks: 0,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
  });
  
  return newVideoRef.id;
}

export async function getVideo(videoId: string): Promise<Video | null> {
  const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
  const videoSnap = await getDoc(videoRef);
  if (!videoSnap.exists()) return null;
  const data = videoSnap.data();
  return {
    id: videoSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as Video;
}

export async function updateVideo(videoId: string, videoData: Partial<VideoFormData>) {
  const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
  await updateDoc(videoRef, {
    ...videoData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteVideo(videoId: string) {
  const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
  await deleteDoc(videoRef);
}

export async function getPublishedVideos(
  lastDoc?: DocumentSnapshot,
  pageSize: number = 10
): Promise<{ videos: Video[]; lastDoc: DocumentSnapshot | null }> {
  let videosQuery = query(
    collection(db, VIDEOS_COLLECTION),
    where('isPublished', '==', true),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );

  if (lastDoc) {
    videosQuery = query(videosQuery, startAfter(lastDoc));
  }

  const querySnapshot = await getDocs(videosQuery);
  const videos: Video[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    videos.push({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Video);
  });

  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  return { videos, lastDoc: lastVisible };
}

export async function getAllVideos(
  lastDoc?: DocumentSnapshot,
  pageSize: number = 10
): Promise<{ videos: Video[]; lastDoc: DocumentSnapshot | null }> {
  let videosQuery = query(
    collection(db, VIDEOS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );

  if (lastDoc) {
    videosQuery = query(videosQuery, startAfter(lastDoc));
  }

  const querySnapshot = await getDocs(videosQuery);
  const videos: Video[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    videos.push({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Video);
  });

  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  return { videos, lastDoc: lastVisible };
}

export async function getVideoStats(): Promise<VideoStats> {
  const videosQuery = query(collection(db, VIDEOS_COLLECTION));
  const querySnapshot = await getDocs(videosQuery);
  
  let totalVideos = 0;
  let totalViews = 0;
  let totalLikes = 0;
  let totalClicks = 0;
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    totalVideos++;
    totalViews += data.views || 0;
    totalLikes += data.likes || 0;
    totalClicks += data.clicks || 0;
  });
  
  return { totalVideos, totalViews, totalLikes, totalClicks };
}

export async function incrementVideoViews(videoId: string) {
  const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
  await updateDoc(videoRef, { views: increment(1) });
}

export async function incrementVideoClicks(videoId: string) {
  const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
  await updateDoc(videoRef, { clicks: increment(1) });
}

export async function incrementVideoLikes(videoId: string, incrementBy: number = 1) {
  const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
  await updateDoc(videoRef, { likes: increment(incrementBy) });
}

// Wishlist Operations
export async function toggleWishlist(userId: string, videoId: string): Promise<boolean> {
  const wishlistQuery = query(
    collection(db, WISHLISTS_COLLECTION),
    where('userId', '==', userId),
    where('videoId', '==', videoId)
  );
  
  const querySnapshot = await getDocs(wishlistQuery);
  
  if (querySnapshot.empty) {
    // Add to wishlist
    const wishlistRef = doc(collection(db, WISHLISTS_COLLECTION));
    await setDoc(wishlistRef, {
      userId,
      videoId,
      createdAt: serverTimestamp(),
    });
    await incrementVideoLikes(videoId, 1);
    return true;
  } else {
    // Remove from wishlist
    const wishlistDoc = querySnapshot.docs[0];
    await deleteDoc(doc(db, WISHLISTS_COLLECTION, wishlistDoc.id));
    await incrementVideoLikes(videoId, -1);
    return false;
  }
}

export async function getUserWishlist(userId: string): Promise<Wishlist[]> {
  const wishlistQuery = query(
    collection(db, WISHLISTS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(wishlistQuery);
  const wishlists: Wishlist[] = [];
  
  for (const docSnapshot of querySnapshot.docs) {
    const data = docSnapshot.data();
    const video = await getVideo(data.videoId);
    if (video) {
      wishlists.push({
        id: docSnapshot.id,
        userId: data.userId,
        videoId: data.videoId,
        video,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    }
  }
  
  return wishlists;
}

export async function isInWishlist(userId: string, videoId: string): Promise<boolean> {
  const wishlistQuery = query(
    collection(db, WISHLISTS_COLLECTION),
    where('userId', '==', userId),
    where('videoId', '==', videoId)
  );
  
  const querySnapshot = await getDocs(wishlistQuery);
  return !querySnapshot.empty;
}

export async function getUserWishlistCount(userId: string): Promise<number> {
  const wishlistQuery = query(
    collection(db, WISHLISTS_COLLECTION),
    where('userId', '==', userId)
  );
  
  const querySnapshot = await getDocs(wishlistQuery);
  return querySnapshot.size;
}
