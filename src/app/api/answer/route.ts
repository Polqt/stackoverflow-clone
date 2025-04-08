import { answerCollection, db } from '@/models/name';
import { databases, users } from '@/models/server/config';
import { NextRequest, NextResponse } from 'next/server';
import { ID } from 'node-appwrite';
import { UserPrefs } from '@/store/Auth';

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId } = await request.json();

    if (!questionId || !answer || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

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

    // Increase author's reputation by 1
    const prefs = await users.getPrefs<UserPrefs>(authorId);

    await users.updatePrefs(authorId, {
      reputation: Number(prefs.reputation) + 1,
    });

    return NextResponse.json(response, {
      status: 201,
    });
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
    const { answerId } = await request.json();

    if (!answerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const answer = await databases.getDocument(db, answerCollection, answerId);

    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    const response = await databases.deleteDocument(
      db,
      answerCollection,
      answerId,
    );

    // Decrease author's reputation by 1
    const prefs = await users.getPrefs<UserPrefs>(answer.authorId);

    await users.updatePrefs(answer.authorId, {
      reputation: Number(prefs.reputation) - 1,
    });

    return NextResponse.json({ data: response }, { status: 200 });
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
