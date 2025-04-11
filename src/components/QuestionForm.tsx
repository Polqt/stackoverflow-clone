'use client';

import { useAuthStore } from '@/store/Auth';
import { useRouter } from 'next/navigation';
import { ID, Models } from 'appwrite';
import { useState } from 'react';
import { databases, storage } from '@/models/client/config';
import {
  db,
  questionAttachmentBucket,
  questionCollection,
} from '@/models/name';
import { slugify } from '@/utils/slugify';

const QuestionForm = ({ question }: { question?: Models.Document }) => {
  const { user } = useAuthStore();
  const [tag, setTag] = useState<string>('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: String(question?.title || ''),
    content: String(question?.content || ''),
    authorId: user?.$id,
    tags: new Set((question?.tags || []) as string[]),
    attachment: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadConfetti = (timeInMS = 3000) => {};

  const create = async () => {
    if (!formData.attachment) throw new Error('Attachment is required');

    const storageResponse = await storage.createFile(
      questionAttachmentBucket,
      ID.unique(),
      formData.attachment,
    );

    const response = await databases.createDocument(
      db,
      questionCollection,
      ID.unique(),
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags),
        attachmentId: storageResponse.$id,
      },
    );

    loadConfetti();

    return response;
  };

  const update = async () => {
    if (!formData.attachment) throw new Error('Attachment is required.');

    const attachmentId = await (async () => {
      if (!formData.attachment) return question?.attachmentId as string;

      await storage.deleteFile(
        questionAttachmentBucket,
        question?.attachmentId,
      );

      const file = await storage.createFile(
        questionAttachmentBucket,
        ID.unique(),
        formData.attachment,
      );

      return file.$id;
    })();

    const response = await databases.updateDocument(
      db,
      questionCollection,
      question?.id,
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags),
        attachmentId: attachmentId,
      },
    );

    return response;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.authorId) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(() => true);
    setError(() => '');

    try {
      const response = question ? await update() : await create();

      if (!response) {
        setError('Failed to create question.');
        return;
      }

      router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
    } catch (error: unknown) {
      console.error(`Error: ${error}`);
    }

    setLoading(() => false);
  };

  return <div></div>; // TODO: Implement the form UI
};

export default QuestionForm;
