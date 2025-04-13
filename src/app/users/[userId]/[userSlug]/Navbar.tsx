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
    <ul className="flex w-full shrink-0 gap-1 overflow-auto sm:w-40 sm:flex-col">
      {items.map(item => (
        <li key={item.name}>
          <Link
            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
              pathname === item.href ? 'bg-blue-500' : 'hover:bg-blue-500/50'
            }`}
            href={item.href}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Navbar;
