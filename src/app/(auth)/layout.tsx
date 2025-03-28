'use client';

import { useAuthStore } from '@/store/Auth';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthStore();

  return (
    <div className="">
      <div className="">{children}</div>
    </div>
  );
};

export default Layout;
