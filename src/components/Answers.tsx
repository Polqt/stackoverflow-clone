'use client';

import { useAuthStore } from '@/store/Auth';
import { Models } from 'appwrite';
import { useState } from 'react';

const Answers = ({
  answers: _answers,
  questionId,
}: {
  answers: Models.DocumentList<Models.Document>;
  questionId: string;
}) => {
  const [answers, setAnswers] = useState(_answers);
  const [newAnswer, setNewAnswer] = useState('');
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !newAnswer) return;

    try {
      const response = await fetch('/api/answer', {
        method: 'POST',
        body: JSON.stringify({
          questionId: questionId,
          answer: newAnswer,
          authorId: user.$id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setNewAnswer(() => '');
      setAnswers(prev => ({
        total: prev.total + 1,
        documents: [
          {
            ...data,
            author: user,
            upvotesDocument: {
              documents: [],
              total: 0,
            },
            downvotesDocument: {
              documents: [],
              total: 0,
            },
            comments: {
              documents: [],
              total: 0,
            },
          },
          ...prev.documents,
        ],
      }));
    } catch (error: unknown) {
      console.error('Error creating answer:', error);
    }
  };

  // const updateAnswer = async (answerId: string, text: string) => {
  //   try {
  //   } catch (error: unknown) {
  //     console.error('Error updating answer:', error);
  //   }
  // };

  const deleteAnswer = async (answerId: string) => {
    try {
      const response = await fetch('/api/answer', {
        method: 'DELETE',
        body: JSON.stringify({
          answerId: answerId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setAnswers(prev => ({
        total: prev.total - 1,
        documents: prev.documents.filter(answer => answer.$id !== answerId),
      }));
    } catch (error: unknown) {
      console.error('Error deleting answer:', error);
    }
  };

  return (
    <>
      
    </>
  );
};

export default Answers;
