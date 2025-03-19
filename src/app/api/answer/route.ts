import { answerCollection, db } from '@/models/name';
import { databases, users } from '@/models/server/config';
import { NextRequest, NextResponse } from 'next/server';
import { ID } from 'node-appwrite';
import { UserPrefs } from '@/store/Auth';

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId } = await request.json();

    const response = await databases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        content: answer,
        authorId: authorId,
        questionId: questionId,
      },
    );

    // Increase the author's reputation
    const prefs = await users.getPrefs<UserPrefs>(authorId);

    await users.updatePrefs(authorId, {
      reputation: Number(prefs.reputation) + 1,
    });

    return NextResponse.json(response, {
      status: 201,
    });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number; code?: number };
    return NextResponse.json(
      {
        error: err?.message || 'Error creating answer',
      },
      { status: err?.status || err.code || 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { answerId } = await request.json();

    const answer = await databases.getDocument(db, answerCollection, answerId);

    const response = await databases.deleteDocument(
      db,
      answerCollection,
      answerId,
    );

    // Decrease the author's reputation
    const prefs = await users.getPrefs<UserPrefs>(answer.authorId);
    await users.updatePrefs(answer.authorId, {
      reputation: Number(prefs.reputation) - 1,
    });

    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number; code?: number };
    return NextResponse.json(
      {
        error: err?.message || 'Error deleting answer',
      },
      { status: err?.status || err.code || 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { answerId, answer } = await request.json();

    const response = await databases.updateDocument(
      db,
      answerCollection,
      answerId,
      { content: answer },
    );

    if (!response.$id) {
      throw new Error('Answer not found');
    }

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number; code?: number };
    return NextResponse.json(
      {
        error: err?.message || 'Error updating answer',
      },
      { status: err?.status || err.code || 500 },
    );
  }
}
