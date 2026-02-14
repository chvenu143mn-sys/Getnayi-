# GetNayi

A video-first fashion discovery platform built with Next.js 15, Firebase, and Bunny CDN.

## Features

### Public Features
- **Vertical Video Feed**: TikTok-style autoplay video feed with snap scrolling
- **Google Authentication**: Secure sign-in with Google OAuth
- **Wishlist**: Save favorite fashion items for later
- **Product Discovery**: Shop directly from video content with one click
- **Mobile-First Design**: Optimized for mobile with responsive desktop support

### Admin Panel
- **Video Management**: CRUD operations for video content
- **Bunny CDN Integration**: Store and serve videos via Bunny CDN
- **Publish Controls**: Draft and publish workflow for content moderation
- **Analytics Dashboard**: Track views, likes, and clicks

## Tech Stack

- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Firebase Auth (Google Provider)
- **Database**: Cloud Firestore
- **Video Hosting**: Bunny CDN
- **UI Components**: Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Authentication and Firestore enabled
- Bunny CDN account (optional for development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd getnayi
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure Firebase:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Google Authentication
   - Create a Firestore database
   - Copy your Firebase config to `.env.local`

5. Configure Firestore Security Rules:
   ```
   Deploy the rules from firestore.rules to your Firebase project
   ```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Firestore Schema

### Users Collection
```typescript
{
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Videos Collection
```typescript
{
  id: string;
  title: string;
  description: string;
  videoUrl: string;        // Bunny CDN URL
  thumbnailUrl: string;    // Bunny CDN URL
  productUrl: string;      // External product link
  productName: string;
  productPrice: number;
  brandName: string;
  brandLogoUrl?: string;
  likes: number;
  views: number;
  clicks: number;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;       // User ID
}
```

### Wishlists Collection
```typescript
{
  id: string;
  userId: string;
  videoId: string;
  createdAt: Timestamp;
}
```

## Admin Setup

To grant admin access to a user:

1. Sign in to the application with Google
2. Go to your Firebase Console → Firestore Database
3. Find the user document in the `users` collection
4. Update the `role` field from `'user'` to `'admin'`

The user can now access the admin panel at `/admin/dashboard`.

## Video Upload Workflow

1. Upload your video to Bunny CDN (or any direct video hosting service)
2. Copy the direct MP4 URL
3. Go to Admin → Videos → Upload
4. Fill in the video details and paste the Bunny CDN URL
5. Set publish status (Draft or Published)
6. Save

## Firestore Indexes

Create the following composite indexes in Firestore:

1. **Videos Collection**:
   - Collection: `videos`
   - Fields: `isPublished` (Ascending), `createdAt` (Descending)

2. **Wishlists Collection**:
   - Collection: `wishlists`
   - Fields: `userId` (Ascending), `createdAt` (Descending)

## Project Structure

```
app/
├── (public)/           # Public route group
│   ├── page.tsx        # Video feed
│   ├── wishlist/       # Wishlist page
│   └── profile/        # User profile
├── admin/              # Admin panel
│   ├── layout.tsx      # Admin layout with protection
│   ├── dashboard/      # Analytics dashboard
│   └── videos/         # Video CRUD
├── layout.tsx          # Root layout
└── globals.css         # Global styles

components/
├── VideoPlayer.tsx     # HTML5 video player with autoplay
├── VideoCard.tsx       # Video card with actions
├── AuthModal.tsx       # Google sign-in modal
├── BottomNav.tsx       # Mobile navigation
├── AdminSidebar.tsx    # Admin navigation
└── VideoForm.tsx       # Video CRUD form

contexts/
└── AuthContext.tsx     # Firebase auth provider

hooks/
├── useInView.ts        # Intersection Observer hook
├── useVideos.ts        # Video fetching hook
└── useWishlist.ts      # Wishlist management hook

lib/
├── firebase.ts         # Firebase initialization
├── firestore.ts        # Firestore operations
└── utils.ts            # Utility functions

types/
└── index.ts            # TypeScript interfaces
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Mobile browsers require videos to be muted for autoplay functionality.

## License

MIT
