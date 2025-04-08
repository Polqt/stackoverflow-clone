'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import DockComponent from '@/components/DockComponent';
import { DotPattern } from '@/components/magicui/dot-pattern';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPage =
    pathname?.startsWith('/(auth)') ||
    pathname?.includes('/login') ||
    pathname?.includes('/register');

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!isPage && (
          <DotPattern
            className={cn(
              '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]',
            )}
          />
        )}
        {children}
      </body>
      {!isPage && <DockComponent />}
    </html>
  );
}
