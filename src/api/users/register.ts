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
        // TODO: Register logic.
    }
}

