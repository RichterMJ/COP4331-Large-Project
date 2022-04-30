import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { MongoClient } from 'mongodb'
import { resolve } from 'path'

// Load env vars from .env file.
import 'dotenv/config'
import { setApp } from './config-routes'

// Get environmental variables.
export const nodeEnv: string = process.env.NODE_ENV as string
export const USDA_API_KEY: string = process.env.USDA_API_KEY as string
const port: string = process.env.PORT || '8080'
const dbUri: string = process.env.MONGODB_URI as string
export const URL: string = `localhost:${port}` // maybe https://git-fit-cop4331.herokuapp.com/

// DB.
const dbClient = new MongoClient(dbUri)

dbClient.connect()

// Server.
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    )
    next()
})

setApp(app, dbClient)

if (process.env.NODE_ENV === 'production') {
    // Set static folder.
    app.use(express.static('frontend/build'))

    app.get('*', (req, res) => {
        res.sendFile(resolve(__dirname, 'app/frontend/build', 'index.html'))
    })
}

app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})
