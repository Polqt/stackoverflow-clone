import { Permission } from 'node-appwrite';
import { commentCollection, db } from '../name';
import { databases } from './config';

export default async function createCommentCollection() {
  await databases.createCollection(db, commentCollection, commentCollection, [
    Permission.read('any'),
    Permission.read('any'),
    Permission.create('any'),
    Permission.update('any'),
    Permission.delete('any'),
  ]);

  console.log(`Collection ${commentCollection} created successfully.`);

  await Promise.all([
    databases.createEnumAttribute(db, commentCollection, 'type', ['answer', 'question'], true), // Type of comment (question or answer)
    databases.createStringAttribute(db, commentCollection, 'content', 50, true),
    databases.createStringAttribute(db, commentCollection, 'typeId', 50, true),
    databases.createStringAttribute(
      db,
      commentCollection,
      'authorId',
      50,
      true,
    ),
  ]);

  console.log(`Attributes for${commentCollection} created successfully.`);
}
