import { Permission } from 'node-appwrite';
import { commentCollection, db } from '../name';
import { databases } from './config';

export default async function createCommentCollection() {
  await databases.createCollection(db, commentCollection, 'commentCollection', [
    Permission.read('any'),
    Permission.read('any'),
    Permission.create('any'),
    Permission.update('any'),
    Permission.delete('any'),
  ]);

  console.log(`Collection ${commentCollection} created successfully.`);

  await Promise.all([
    databases.createStringAttribute(db, commentCollection, 'type', 50, true), // Type of comment (question or answer)
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
