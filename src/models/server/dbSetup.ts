import { db } from '../name';
import createAnswerCollection from './answer.collection';
import createCommentCollection from './comment.collection';
import createQuestionCollection from './question.collection';
import createVoteCollection from './vote.collection';
import { databases } from './config';

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log(`Database ${db} connected successfully.`);
  } catch (error: unknown) {
    try {
      await databases.create(db, db);
      console.log(`Database ${db} created successfully.`);

      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createVoteCollection(),
        createCommentCollection(),
      ]);

      console.log(`Collections created successfully in database ${db}.`);
      console.log(`Database ${db} setup completed successfully.`);
      console.log(`Database ${db} connected successfully.`);
    } catch (error: unknown) {
      console.error(`Error creating database ${db}:`, error);
    }
    console.error(`Database ${db} not found.`, error);
  }

  return databases;
}
