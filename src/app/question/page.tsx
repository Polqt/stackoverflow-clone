import QuestionCard from '@/components/QuestionCard';
import { answerCollection, db, questionCollection } from '@/models/name';
import { databases, users } from '@/models/server/config';
import { UserPrefs } from '@/store/Auth';
import Link from 'next/link';
import { Query } from 'node-appwrite';
import Search from './Search';
import Pagination from '@/components/Pagination';

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

  if (searchParams.tag) queries.push(Query.equal('tags', searchParams.tag));

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

  questions.documents = await Promise.all(
    questions.documents.map(async ques => {
      const [author, answers, votes] = await Promise.all([
        users.get<UserPrefs>(ques.authorId),
        databases.listDocuments(db, answerCollection, [
          Query.equal('questionId', ques.$id),
          Query.limit(1),
        ]),
        databases.listDocuments(db, 'votes', [
          Query.equal('type', 'question'),
          Query.equal('typId', ques.$id),
          Query.limit(1),
        ]),
      ]);

      return {
        ...ques,
        totalAnswers: answers.total,
        totalVotes: votes.total,
        author: {
          id: author.$id,
          name: author.name,
          reputation: author.prefs.reputation,
        },
      };
    }),
  );

  return (
    <div className="container mx-auto px-4 pb-20 pt-36">
      <div className="mb-10 flex items-center justify-center">
        <h1 className="text-4xl font-bold">All Questions</h1>
        <Link href={'/questions/asks'}>
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:From-white dark:to-slate-900/10 lg:text-lg">
            Ask a question
          </span>
        </Link>
      </div>

      <div className="mb-4">
        <Search />
      </div>
      <div className="mb-4">
        <p>{questions.total} questions</p>
      </div>
      <div className="mb-4 max-w-3xl space-y-6">
        {questions.documents.map(ques => (
          <QuestionCard key={ques.$id} ques={ques} />
        ))}
      </div>
      <Pagination total={questions.total} limit={30} />
    </div>
  );
};

export default Page;
