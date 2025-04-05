import { Permission } from 'node-appwrite';
import { questionAttachmentBucket } from '../name';
import { storage } from './config';

export default async function getOrCreateStorage() {
  try {
    await storage.getBucket(questionAttachmentBucket);
    console.log(`Storage connected successfully.`);
  } catch (error: unknown) {
    try {
      await storage.createBucket(
        questionAttachmentBucket,
        questionAttachmentBucket,
        [
          Permission.read('any'),
          Permission.read('users'),
          Permission.create('users'),
          Permission.update('users'),
          Permission.delete('users'),
        ],
        false,
        undefined,
        undefined,
        ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      );

      console.log(`Storage connected successfully.`);
      console.log(`Storage created successfully.`);
    } catch (error: unknown) {
      console.error(`Failed to create storage.`, error);
    }

    console.error(`Failed to connect to storage.`, error);
  }
}
