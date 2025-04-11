'use client';

import { cn } from '@/lib/utils';
import { databases } from '@/models/client/config';
import { db, voteCollection } from '@/models/name';
import { useAuthStore } from '@/store/Auth';
import { IconCaretUpFilled } from '@tabler/icons-react';
import { Models, Query } from 'appwrite';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const VoteButton = ({
  type,
  id,
  upvotes,
  downvotes,
  className,
}: {
  type: 'question' | 'answer';
  id: string;
  upvotes: Models.DocumentList<Models.Document>;
  downvotes: Models.DocumentList<Models.Document>;
  className?: string;
}) => {
  const [votedDocument, setVotedDocument] = useState<Models.Document | null>();
  const [votedResult, setVotedResult] = useState<number>(
    upvotes.total - downvotes.total,
  );

  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (user) {
        const response = await databases.listDocuments(db, voteCollection, [
          Query.equal('type', type),
          Query.equal('typeId', id),
          Query.equal('voteById', user.$id),
        ]);
        setVotedDocument(response.documents[0] || null);
      }
    })();
  }, [user, type, id]);

  const toggleUpvote = async () => {
    if (!user) return router.push('/login');
    if (votedDocument === undefined) return;

    try {
      const response = await fetch(`/api/vote`, {
        method: 'POST',
        body: JSON.stringify({
          voteById: user.$id,
          voteStatus: 'upvoted',
          type,
          typeId: id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setVotedResult(() => data.data.voteResult);
      setVotedDocument(() => data.data.document);
    } catch (error: unknown) {
      console.error(`Error upvoting: ${error}`);
    }
  };

  const toggleDownvote = async () => {
    if (!user) return router.push('/login');
    if (votedDocument === undefined) return;

    try {
      const response = await fetch(`/api/vote`, {
        method: 'POST',
        body: JSON.stringify({
          voteById: user.$id,
          voteStatus: 'downvoted',
          type,
          typeId: id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setVotedResult(() => data.data.voteResult);
      setVotedDocument(() => data.data.document);
    } catch (error: unknown) {
      console.error(`Error downvoting: ${error}`);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2 pl-4', className)}>
      <button
        title="Upvote"
        className={cn(
          '',
          votedDocument && votedDocument.voteStatus === 'upvoted'
            ? 'border-orange-500 text-orange-500'
            : 'border-gray-300 text-gray-500',
        )}
        onClick={toggleUpvote}
      >
        <IconCaretUpFilled />
      </button>

      <span className="">{votedResult}</span>
    </div>
  );
};

export default VoteButton;
