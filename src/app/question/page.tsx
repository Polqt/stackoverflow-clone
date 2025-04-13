import { databases } from '@/models/client/config';
import { answerCollection, db, questionCollection } from '@/models/name';
import { users } from '@/models/server/config';
import { UserPrefs } from '@/store/Auth';
import { Query } from 'node-appwrite';

const Page = async ({
  searchParams,
}: {
  searchParams: { page?: string; tag?: string; search?: string };
}) => {
  searchParams.page ||= '1';

  const queries = [
    Query.orderDesc('$createdAt'),
    Query.offset((+searchParams.page - 1) * 30),
    Query.limit(30),
  ];

  if (searchParams.tag) queries.push(Query.equal('tags',searchParams.tag));

  if (searchParams.search) {
    queries.push(
      Query.or([
        Query.search('title', searchParams.search),
        Query.search('content', searchParams.search),
      ]),
    );
  }

  const questions = await databases.listDocuments(
    db,
    questionCollection,
    queries,
  );
  console.log(questions);

  questions.documents = await Promise.all([
    questions.documents.map(async ques => {
      const [author, answers, votes] = await Promise.all([
        users.get<UserPrefs>(ques.authorId),
        answerCollection,
        [Query.equal('questionId', ques.$id), Query.limit(1)],
      ]);

      return {
        ...ques,
        totalAnswers: answers.total,
        totalVotes: votes.total,
        author: {
          $id: author.$id,
          reputation: author.prefs.reputation,
          name: author.name,
        },
      };
    }),
  ]);

  return (
    <div>
      <h1></h1>
    </div>
  );
};

export default Page;
