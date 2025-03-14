import { db } from "../name"
import createAnswerCollection from "./answer.collections"
import createQuestionCollection from "./question.collection"
import createCommentCollection from "./comment.collection"
import createVoteCollection from "./vote.collection"
import { databases } from "./config"

export default async function getOrCreateDB() {
    try {
        await databases.get(db)
        console.log('Database connection')
    } catch (error) {
        try {
            await databases.create(db, db)
            console.log('Database created')

            // Create collections
            await Promise.all([
                createAnswerCollection(),
                createQuestionCollection(),
                createCommentCollection(),
                createVoteCollection()
            ])
            console.log('Collections created', [db])
            console.log('Database connection created')
        } catch (error) {
            console.error('Database creation failed', error)
        }
        console.error('Database connection failed', error)
    }

    return databases
}