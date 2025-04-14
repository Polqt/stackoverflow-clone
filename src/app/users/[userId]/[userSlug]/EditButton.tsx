'use client';

import { useAuthStore } from '@/store/Auth';
import { IconEdit } from '@tabler/icons-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const EditButton = () => {
  const { userId, userSlug } = useParams();
  const { user } = useAuthStore();

  if (user?.$id !== userId) return null;

  return (
    <Link
      href={`/users/${userId}/${userSlug}/edit`}
      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
    >
      <IconEdit className="w-4 h-4" />
      <span>Edit Profile</span>
    </Link>
  );
};

export default EditButton;
