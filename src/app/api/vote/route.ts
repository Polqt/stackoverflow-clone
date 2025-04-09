import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from '@/models/name';
import { databases, users } from '@/models/server/config';
import { UserPrefs } from '@/store/Auth';
import { NextRequest, NextResponse } from 'next/server';
import { ID, Query } from 'node-appwrite';

export async function POST(request: NextRequest) {
  try {
    const { voteById, typeId, type, voteStatus } = await request.json();

    if (!voteById || !typeId || !type || !voteStatus) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const response = await databases.listDocuments(db, voteCollection, [
      Query.equal('type', type),
      Query.equal('typeId', typeId),
      Query.equal('voteById', voteById),
    ]);

    // If the user has already voted on the question or answer, then the user try to vote again, we need to delete the previous vote.
    if (response.documents.length > 0) {
      await databases.deleteDocument(
        db,
        voteCollection,
        response.documents[0].$id,
      );

      // Decrease the reputation
      const QuestionOrAnswer = await databases.getDocument(
        db,
        type === 'question' ? questionCollection : answerCollection,
        typeId,
      );

      const authorPrefs = await users.getPrefs<UserPrefs>(
        QuestionOrAnswer.authordId,
      );

      await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
        reputation:
          response.documents[0].voteStatus === 'upvoted'
            ? Number(authorPrefs.reputation) - 1
            : Number(authorPrefs.reputation) + 1,
      });
    }

    // Previous vote does not match the current vote status
    if (response.documents[0]?.voteStatus !== voteStatus) {
      const doc = await databases.createDocument(
        db,
        voteCollection,
        ID.unique(),
        {
          type,
          typeId,
          voteById,
          voteStatus,
        },
      );

      if (!doc) {
        return NextResponse.json(
          { error: 'Error creating vote' },
          { status: 500 },
        );
      }

      // Increase or Decrease the author's reputation in the question or answer
      const QuestionOrAnswer = await databases.getDocument(
        db,
        type === 'question' ? questionCollection : answerCollection,
        typeId,
      );

      const authorPrefs = await users.getPrefs<UserPrefs>(
        QuestionOrAnswer.authordId,
      );

      // If vote was present, then we need to increase or decrease the reputation
      if (response.documents[0]) {
        await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
          reputation:
            response.documents[0].voteStatus === 'upvoted'
              ? Number(authorPrefs.reputation) - 1
              : Number(authorPrefs.reputation) + 1,
        });
      } else {
        await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorid, {
          reputation:
            voteStatus === 'downvoted'
              ? Number(authorPrefs.reputation) + 1
              : Number(authorPrefs.reputation) - 1,
        });
      }
    }

    const [upvotes, downvotes] = await Promise.all([
      databases.listDocuments(db, voteCollection, [
        Query.equal('type', type),
        Query.equal('typeId', typeId),
        Query.equal('voteStatus', 'upvoted'),
        Query.equal('voteById', voteById),
        Query.limit(1), // Limit to 1 document
      ]),
      databases.listDocuments(db, voteCollection, [
        Query.equal('type', type),
        Query.equal('typeId', typeId),
        Query.equal('voteStatus', 'downvoted'),
        Query.equal('voteById', voteById),
        Query.limit(1), // Limit to 1 document
      ]),
    ]);

    return NextResponse.json(
      {
        data: {
          document: null,
          voteResult: (upvotes.total = downvotes.total),
        },
        message: 'Vote handled successfully',
      },
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error?.message : 'Error creating answer',
      },
      {
        status:
          error instanceof Error && 'status' in error
            ? (error as { status: number }).status
            : 500,
      },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const {} = await request.json();
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error?.message : 'Error creating answer',
      },
      {
        status:
          error instanceof Error && 'status' in error
            ? (error as { status: number }).status
            : 500,
      },
    );
  }
}
