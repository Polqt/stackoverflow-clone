import {
  answerCollection,
  db,
  questionCollection,
  votesCollection,
} from '@/models/name';
import { databases, users } from '@/models/server/config';
import { UserPrefs } from '@/store/Auth';
import { NextRequest, NextResponse } from 'next/server';
import { ID, Query } from 'node-appwrite';

export async function POST(request: NextRequest) {
  try {
    const { voteById, voteStatus, type, typeId } = await request.json();

    const response = await databases.listDocuments(db, votesCollection, [
      Query.equal('type', type),
      Query.equal('typeId', typeId),
      Query.equal('voteById', voteById),
    ]);

    if (response.documents.length > 0) {
      await databases.deleteDocument(
        db,
        votesCollection,
        response.documents[0].$id,
      );

      // Decrease the author's reputation
      const QuestionOrAnswer = await databases.getDocument(
        db,
        type === 'question' ? questionCollection : answerCollection,
        typeId,
      );

      const authorPrefs = await users.getPrefs<UserPrefs>(
        QuestionOrAnswer.authorId,
      );

      await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
        reputation:
          response.documents[0].voteStatus === 'thumbup'
            ? Number(authorPrefs.reputation) - 1
            : Number(authorPrefs.reputation) + 1,
      });
    }

    // Previous votes does not exist or vote status changed
    if (response.documents[0]?.voteStatus !== voteStatus) {
      const doc = await databases.createDocument(
        db,
        votesCollection,
        ID.unique(),
        {
          type,
          typeId,
          voteStatus,
          voteById,
        },
      );

      // Increase or decrease the author's reputation
      const QuestionOrAnswer = await databases.getDocument(
        db,
        type === 'question' ? questionCollection : answerCollection,
        typeId,
      );

      const authorPrefs = await users.getPrefs<UserPrefs>(
        QuestionOrAnswer.authorId,
      );

      // If the vote is present
      if (response.documents[0]) {
        await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
          // Previous vote was thumbsup and new value is thumbsdown, so we have to decrease the reputation
          reputation:
            response.documents[0].voteStatus === 'thumbup'
              ? Number(authorPrefs.reputation) - 1
              : Number(authorPrefs.reputation) + 1,
        });
      } else {
        await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
          reputation:
            voteStatus === 'thumbup'
              ? Number(authorPrefs.reputation) + 1
              : Number(authorPrefs.reputation) - 1,
        });
      }
      
    }

    const [thumbsup, thumbsdown] = await Promise.all([
      databases.listDocuments(db, votesCollection, [
        Query.equal('type', type),
        Query.equal('typeId', typeId),
        Query.equal('voteStatus', 'thumbup'),
        Query.equal('voteById', voteById),
        Query.limit(1),
      ]),
      databases.listDocuments(db, votesCollection, [
        Query.equal('type', type),
        Query.equal('typeId', typeId),
        Query.equal('voteStatus', 'thumbdown'),
        Query.equal('voteById', voteById),
        Query.limit(1),
      ]),
    ]);

    return NextResponse.json(
      {
        data: {
          document: null,
          voteResult: (thumbsup.total = thumbsdown.total),
        },
        message: 'Vote created successfully',
      },
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number; code?: number };
    return NextResponse.json(
      {
        error: err?.message || 'Error in voting ',
      },
      { status: err?.status || err.code || 500 },
    );
  }
}
