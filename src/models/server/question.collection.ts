import { Permission } from 'node-appwrite';
import { db, questionCollection } from '../name';
import { databases } from './config';

export default async function createQuestionCollection() {
  // Create collection
  await databases.createCollection(db, questionCollection, questionCollection, [
    Permission.read('any'),
    Permission.read('users'),
    Permission.create('users'),
    Permission.update('users'),
    Permission.delete('users'),
  ]);
  console.log('Question collection created');

  // Create attributes
  await Promise.all([
    databases.createStringAttribute(db, questionCollection, 'title', 100, true),
    databases.createStringAttribute(
      db,
      questionCollection,
      'content',
      10000,
      true,
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      'authorId',
      50,
      true,
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      'tags',
      50,
      true,
      undefined,
      true,
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      'attachmendId',
      50,
      false,
    ),
  ]);

  console.log('Question attributes created');

  // Create indexes
  /*
  await Promise.all([
    databases.createIndex(
      db,
      quesitionCollection,
      'title',
      IndexType.Fulltext,
      ['title'],
      ['asc'],
    ),
    databases.createIndex(
      db,
      quesitionCollection,
      'content',
      IndexType.Fulltext,
      ['content'],
      ['asc'],
    ),
  ]);
  */
}
