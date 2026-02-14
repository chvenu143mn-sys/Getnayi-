import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GetNayi - Discover Fashion Through Video",
  description: "A video-first fashion discovery platform. Swipe, like, and shop the latest trends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#18181b',
                color: '#fafafa',
                border: '1px solid #27272a',
              },
              success: {
                iconTheme: {
                  primary: '#ec4899',
                  secondary: '#18181b',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
