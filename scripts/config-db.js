/* One-time script to configure the database. */

import { MongoClient } from "mongodb";
import 'dotenv/config'

const dbUri = process.env.MONGODB_URI
const dbClient = new MongoClient(dbUri)

;(async () => {
    await dbClient.connect()

    dbClient.db().collection('Users').createIndex({ email: 1 }, { unique: true })
})()



