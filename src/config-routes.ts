import { Express } from 'express'
import { MongoClient } from 'mongodb'
import { login } from './api/users/login'
import { register } from './api/users/register'

/* Set up the routing. Logic should go under './api/'. */
export function setApp (app: Express, client: MongoClient) {

    app.post('/users/login', login(app, client))
    app.post('/users/register', register(app, client))
    // etc.

}
