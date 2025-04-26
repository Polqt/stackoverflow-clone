import { databases } from '@/models/client/config';
import {
  answerCollection,
  commentCollection,
  db,
  questionCollection,
  voteCollection,
} from '@/models/name';
import { users } from '@/models/server/config';
import { UserPrefs } from '@/store/Auth';
import { Query } from 'node-appwrite';

const Page = async ({ params }: { params: { quesId: string; quesName: string } }) => {
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
  [comments.documents, answers.documents] = await Promise.all([
    Promise.all(
      comments.documents.map(async comment => {
        const author = await users.get<UserPrefs>(comment.authorId);
        return {
          ...comment,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation,
          },
        };
      }),
    ),
    Promise.all(
      answers.documents.map(async answer => {
        const [author, upvotes, downvotes] = await Promise.all([
          users.get<UserPrefs>(answer.authorId),
          databases.listDocuments(db, voteCollection, [
            Query.equal('typeId', answer.$id),
            Query.equal('type', 'answer'),
            Query.equal('voteStatus', 'upvoted'),
            Query.limit(1),
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal('typeId', answer.$id),
            Query.equal('type', 'answer'),
            Query.equal('voteStatus', 'downvoted'),
            Query.limit(1),
          ]),
          databases.listDocuments(db, commentCollection, [
            Query.equal('type', 'answer'),
            Query.equal('typeId', answer.$id),
            Query.orderDesc('$createdAt'),
          ]),
        ]);

        comments.documents = await Promise.all(
          comments.documents.map(async comment => {
            const author = await users.get<UserPrefs>(comment.authorId);
            return {
              ...comment,
              author: {
                $id: author.$id,
                name: author.name,
                reputation: author.prefs.reputation,
              },
            };
          }),
        );

        return {
          ...answer,
          comments,
          upvotesDocuments: upvotes,
          downvotesDocuments: downvotes,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation,
          },
        };
      }),
    ),
  ]);

  return (
    <div>
      <h1></h1>
    </div>
  );
};

export default Page;
