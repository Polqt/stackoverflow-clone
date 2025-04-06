import { useAuthStore } from '@/store/Auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  return (
    <html lang="en">
      <body className={``}>{children}</body>
    </html>
  );
};

export default Layout;
