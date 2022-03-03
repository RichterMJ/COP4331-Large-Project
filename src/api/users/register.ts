import { RequestHandler, Request, Response, Express } from 'express'
import { MongoClient } from 'mongodb'

export enum RegisterError {
    Ok = '',
    ExistingUser = 1,
    ServerError
}

export type RegisterRequest = {
    username: string
    password: string
    firstname: string
    lastname: string
}

export type RegisterResponse = {
    error: RegisterError
}

/* Returns a function of type `RequestHandler` to be used in a route. */
export function register(app: Express, client: MongoClient): RequestHandler {
    return async (req: Request, res: Response) => {
        let response: RegisterResponse = { error: RegisterError.Ok }

        try {
            const { username, password, firstname, lastname } = req.body as RegisterRequest
            const db = client.db()

            db.collection('Users')
              .insertOne({ username, password, firstname, lastname })

        } catch (e) {
            if ((e as WriteError).code === 11000) {
                response = {
                    error: RegisterError.ExistingUser
                }
              } else {
                response = {
                    error: RegisterError.ServerError
                }
              }
        }

        res.status(200).json(response)
    }
}

