import { Permission } from 'appwrite';
import { db, votesCollection } from '../name';
import { databases } from './config';

export default async function createVoteCollection() {
  await databases.createCollection(db, votesCollection, votesCollection, [
    Permission.create('users'),
    Permission.read('any'),
    Permission.read('users'),
    Permission.update('users'),
    Permission.delete('users'),
  ]);
  console.log('Vote collection created');

  await Promise.all([
    databases.createEnumAttribute(
      db,
      votesCollection,
      'type',
      ['question', 'answer'],
      true,
    ),
    databases.createStringAttribute(db, votesCollection, 'typeId', 50, true),
    databases.createEnumAttribute(
      db,
      votesCollection,
      'voteStatus',
      ['thumbsup', 'thumbsdown'],
      true,
    ),
    databases.createStringAttribute(db, votesCollection, 'voteById', 50, true),
  ])
  console.log('Vote collection attributes created');
}
