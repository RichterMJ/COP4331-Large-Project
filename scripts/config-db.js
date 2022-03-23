/* One-time script to configure the database. */

const mongodb = require('mongodb')
const dotenv = require('dotenv')
dotenv.config()

const searchIndexes = `
In collection "Recipes" add search index:
{
    "analyzer": "lucene.standard",
    "searchAnalyzer": "lucene.standard",
    "mappings": {
        "dynamic": false,
        "fields": {
            "description": {
                "type": "string",
                "analyzer": "lucene.standard"
            }
        }
    }
}
`

const dbUri = process.env.MONGODB_URI
const dbClient = new mongodb.MongoClient(dbUri)

    ; (async () => {

        console.log('Configuring database...')

        try {

            await dbClient.connect()
            await dbClient
                .db()
                .collection('Users')
                .createIndex({ email: 1 }, { unique: true })

            // I can't figure out how to automatically add Atlas's search indexes via `$ node` or `$ mongosh`.
            console.log('Manually add the following Atlas indexes on the Atlas website:')
            console.log(searchIndexes)

        } catch (e) {
            console.log(e)
            process.exit(1)
        }

        console.log('Done.')
        process.exit()
    })()



