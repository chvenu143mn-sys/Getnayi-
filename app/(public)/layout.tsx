'use client';

import { BottomNav } from '@/components/BottomNav';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
