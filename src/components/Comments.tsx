'use client';

import { databases } from '@/models/client/config';
import { commentCollection, db } from '@/models/name';
import { useAuthStore } from '@/store/Auth';
import { ID, Models } from 'appwrite';
import { useState } from 'react';

const Comments = ({
  comments: _comments,
  type,
  typeId,
  className,
}: {
  comments: Models.DocumentList<Models.Document>;
  type: 'question' | 'answer';
  typeId: string;
  className?: string;
}) => {
  const [comments, setComments] = useState(_comments);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !newComment) return;

    try {
      const response = await databases.createDocument(
        db,
        commentCollection,
        ID.unique(),
        {
          content: newComment,
          authorId: user.$id,
          type: type,
          typeId: typeId,
        },
      );

      setNewComment(() => '');
      setComments(prev => ({
        total: prev.total + 1,
        documents: [{ ...response, author: user }, ...prev.documents],
      }));
    } catch (error: unknown) {
      console.error('Error creating comment:', error);
    }
  };

  const updateComment = async (commentId: string, text: string) => {
    try {
    } catch (error: unknown) {
      console.error('Error updating comment:', error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await databases.deleteDocument(db, commentCollection, commentId);

      setComments(prev => ({
        total: prev.total - 1,
        documents: prev.documents.filter(comment => comment.$id !== commentId),
      }));
    } catch (error: unknown) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div>
      <h1></h1>
    </div>
  );
};

export default Comments;
