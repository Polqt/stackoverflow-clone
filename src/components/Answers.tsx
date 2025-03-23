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

    if (!newAnswer || !user) return;

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

      if (!response.ok) throw data;

      setNewAnswer(() => '');
      setAnswers(prev => ({
        total: prev.total + 1,
        documents: [
          {
            ...data,
            author: user,
          },
          ...prev.documents,
        ],
      }));
    } catch (error) {}
  };
};
