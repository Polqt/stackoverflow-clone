'use client';

import { useAuthStore } from '@/store/Auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);


  return (
    <div className=''>
     {children}
    </div>
  );
};

export default Layout;
