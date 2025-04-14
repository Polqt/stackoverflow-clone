
import { MagicCard } from '@/components/magicui/magic-card';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { answerCollection, db, questionCollection } from '@/models/name';
import { databases, users } from '@/models/server/config';
import { UserPrefs } from '@/store/Auth';
import { IconCheck, IconHelp, IconTrophy } from '@tabler/icons-react';
import { Query } from 'node-appwrite';

const Page = async ({
  params,
}: {
  params: { userId: string; userSlug: string };
}) => {
  const resolvedParams = await Promise.resolve(params);

  const [user, questions, answers] = await Promise.all([
    users.get<UserPrefs>(resolvedParams.userId),
    databases.listDocuments(db, questionCollection, [
      Query.equal('authorId', resolvedParams.userId),
      Query.limit(1),
    ]),
    databases.listDocuments(db, answerCollection, [
      Query.equal('authorId', resolvedParams.userId),
      Query.limit(1),
    ]),
  ]);

  const stats = [
    {
      label: 'Reputation',
      value: user.prefs.reputation,
      icon: <IconTrophy className="w-6 h-6 text-amber-500" />,
      color: 'from-amber-500/20 to-amber-300/20',
      textColor: 'text-amber-600',
    },
    {
      label: 'Questions Asked',
      value: questions.total,
      icon: <IconHelp className="w-6 h-6 text-blue-500" />,
      color: 'from-blue-500/20 to-blue-300/20',
      textColor: 'text-blue-600',
    },
    {
      label: 'Answers Given',
      value: answers.total,
      icon: <IconCheck className="w-6 h-6 text-green-500" />,
      color: 'from-green-500/20 to-green-300/20',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">User Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(stat => (
          <MagicCard
            key={stat.label}
            className="p-6 cursor-default hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-30 pointer-events-none -z-10 rounded-xl overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color}`}
              ></div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-gray-600 dark:text-gray-300">
                {stat.label}
              </span>
              <div>{stat.icon}</div>
            </div>
            <div
              className={`text-3xl font-bold ${stat.textColor} dark:text-white`}
            >
              <NumberTicker value={stat.value} />
            </div>
          </MagicCard>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Activity Overview</h2>
        <MagicCard className="h-64 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
          </div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              Active Contributor
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              {user.name} has been contributing valuable content and actively
              engaging with the community.
            </p>
          </div>
        </MagicCard>
      </div>
    </div>
  );
};

export default Page;