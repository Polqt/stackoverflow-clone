import { avatars } from '@/models/client/config';
import { users } from '@/models/server/config';
import { UserPrefs } from '@/store/Auth';
import convertDateToRelativeTime from '@/utils/relativeTime';
import { IconCalendar, IconClock } from '@tabler/icons-react';
import Navbar from './Navbar';
import EditButton from './EditButton';

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string; userSlug: string };
}) => {
  const resolvedParams = await Promise.resolve(params);
  const user = await users.get<UserPrefs>(resolvedParams.userId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="px-6 py-6 sm:px-8 sm:py-8 relative">
          <div className="sm:flex sm:items-end sm:justify-between">
            {/* Avatar and User Info */}
            <div className="flex items-center sm:items-start">
              <div className="-mt-16 sm:-mt-20 relative">
                <picture>
                  <img
                    src={avatars.getInitials(user.name, 200, 200)}
                    alt={user.name}
                    className="h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white dark:ring-gray-800 object-cover"
                  />
                </picture>
              </div>
              <div className="ml-4 sm:ml-6 mt-2 sm:-mt-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <IconCalendar className="w-4 h-4 mr-1.5" />
                    <span>
                      Joined{' '}
                      {convertDateToRelativeTime(new Date(user.$createdAt))}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <IconClock className="w-4 h-4 mr-1.5" />
                    <span>
                      Last active{' '}
                      {convertDateToRelativeTime(new Date(user.$updatedAt))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Edit Button */}
            <div className="mt-4 sm:mt-0">
              <EditButton />
            </div>
          </div>
        </div>
        {/* Navigation */}
        <div className="px-4 sm:px-0">
          <Navbar />
        </div>
      </div>
      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;
