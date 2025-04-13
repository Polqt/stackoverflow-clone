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
    <div>
      <h1></h1>
    </div>
  );
};

export default Page;
