import { RequestHandler, Request, Response, Express } from 'express'
import { MongoClient, WriteError } from 'mongodb'
import { json } from 'stream/consumers'

export enum RegisterError {
    Ok = 0,
    ExistingUser,
    ServerError
}

export type RegisterRequest = {
    firstName: string
    lastName: string
    weight: string
    email: string
    password: string
}

export type RegisterResponse = {
    error: RegisterError
}

/* Returns a function of type `RequestHandler` to be used in a route. */

//TODO: Check for duplicate email
export function register(app: Express, client: MongoClient): RequestHandler {
    return async (req: Request, res: Response) => {
        let response: RegisterResponse = { error: RegisterError.Ok }

        try {
            const { firstName, lastName, weight, email, password } = req.body as RegisterRequest
            const db = client.db()

            db.collection('Users')
              .insertOne({ firstName, lastName, weight, email, password })

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

