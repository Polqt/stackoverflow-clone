import { MagicCard } from '@/components/magicui/magic-card';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { answerCollection, db, questionCollection } from '@/models/name';
import { databases, users } from '@/models/server/config';
import { UserPrefs } from '@/store/Auth';
import { Query } from 'node-appwrite';

const Page = async ({
  params,
}: {
  params: { userId: string; userSlug: string };
}) => {
  const [user, questions, answers] = await Promise.all([
    users.get<UserPrefs>(params.userId),
    databases.listDocuments(db, questionCollection, [
      Query.equal('authorId', params.userId),
      Query.limit(1),
    ]),
    databases.listDocuments(db, answerCollection, [
      Query.equal('authorId', params.userId),
      Query.limit(1),
    ]),
  ]);

  return (
    <div className="flex h-[500px] w-full flex-col gap-4 lg:h-[250px] lg:flex-row">
      <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
        <div className="absolute inset-x-4 top-4">
          <h2 className="text-xl font-medium">Reputation</h2>
        </div>
        <p>
          <NumberTicker value={user.prefs.reputation} />
        </p>
      </MagicCard>
      <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
        <div className="absolute inset-x-4 top-4">
          <h2 className="text-xl font-medium">Question Asked</h2>
        </div>
        <p>
          <NumberTicker value={questions.total} />
        </p>
      </MagicCard>
      <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
        <div className="absolute inset-x-4 top-4">
          <h2 className="text-xl font-medium">Answers Given</h2>
        </div>
        <p>
          <NumberTicker value={answers.total} />
        </p>
      </MagicCard>
    </div>
  );
};

export default Page;
