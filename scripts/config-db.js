/* One-time script to configure the database. */

const mongodb = require('mongodb')
const dotenv = require('dotenv')
dotenv.config()

const dbUri = process.env.MONGODB_URI
const dbClient = new mongodb.MongoClient(dbUri)

;(async () => {

    console.log('Configuring database...')

    try {

        await dbClient.connect()
        await dbClient
            .db()
            .collection('Users')
            .createIndex({ email: 1 }, { unique: true })

    } catch (e) {
        console.log(e)
        process.exit(1)
    }

    console.log('Done.')
    process.exit()
})()



