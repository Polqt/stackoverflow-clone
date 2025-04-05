import { Permission } from "node-appwrite";
import { db, voteCollection } from "../name";
import { databases } from "./config";


export default async function createVoteCollection() {
    await databases.createCollection(db, voteCollection, 'voteCollection', [
      Permission.read('any'),
      Permission.read('users'),
      Permission.create('users'),
      Permission.update('users'),
      Permission.delete('users'),
    ]);

    console.log(`Collection ${voteCollection} created successfully.`);

    await Promise.all([
      databases.createStringAttribute(db, voteCollection, 'voteById', 50, true),
      databases.createStringAttribute(db, voteCollection, 'typeId', 50, true),
      databases.createStringAttribute(db, voteCollection, 'type', 50, true), // Type of vote (question or answer)
      databases.createStringAttribute(db, voteCollection, 'voteStatus', 50, true), // Upvote or Downvote
    ]);

    console.log(`Attributes for ${voteCollection} created successfully.`);
}