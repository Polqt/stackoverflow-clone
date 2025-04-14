'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const Navbar = () => {
  const { userId, userSlug } = useParams();
  const pathname = usePathname();

  const items = [
    {
      name: 'Summary',
      href: `/users/${userId}/${userSlug}`,
    },
    {
      name: 'Questions',
      href: `/questions/${userId}/${userSlug}`,
    },
    {
      name: 'Answers',
      href: `/answers/${userId}/${userSlug}`,
    },
    {
      name: 'Votes',
      href: `/votes/${userId}/${userSlug}`,
    },
  ];

  return (
    <nav className="border-b dark:border-gray-700">
      <div className="flex overflow-x-auto scrollbar-hide">
        {items.map(item => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              relative py-4 px-6 text-sm font-medium whitespace-nowrap
              ${
                pathname === item.href
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }
            `}
          >
            {item.name}
            {pathname === item.href && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
