import { databases } from '@/models/client/config';
import {
  answerCollection,
  commentCollection,
  db,
  questionCollection,
  voteCollection,
} from '@/models/name';
import { UserPrefs } from '@/store/Auth';
import { Query } from 'node-appwrite';


const Page = async ({ params }: { quesId: string; quesName: string }) => {
  const [question, answers, upvotes, downvotes, comments] = await Promise.all([
    databases.getDocument(db, questionCollection, params.quesId),
    databases.listDocuments(db, answerCollection, [
      Query.orderDesc('$createdAt'),
      Query.equal('questionId', params.quesId),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal('typeId', params.quesId),
      Query.equal('type', 'question'),
      Query.equal('voteStatus', 'upvoted'),
      Query.limit(1),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal('typeId', params.quesId),
      Query.equal('type', 'question'),
      Query.equal('voteStatus', 'downvoted'),
      Query.limit(1),
    ]),
    databases.listDocuments(db, commentCollection, [
      Query.equal('type', 'question'),
      Query.equal('typeId', params.quesId),
      Query.orderDesc('$createdAt'),
    ]),
  ]);

  const author = await users.get<UserPrefs>(question.authorId);

  return (
    <div>
      <h1></h1>
    </div>
  );
};

export default Page;
