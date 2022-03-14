import { RequestHandler, Request, Response, Express } from 'express'
import { MongoClient, WriteError } from 'mongodb'
import { json } from 'stream/consumers'

export enum RegisterError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    ExistingUser,
}

export type RegisterRequest = {
    firstName: string
    lastName: string
    weight: number
    email: string
    password: string
}

export type RegisterResponse = {
    error: RegisterError
}

/* Returns a function of type `RequestHandler` to be used in a route. */

export function register(app: Express, client: MongoClient): RequestHandler {

    /* Programmatically ensure the request body is of type `FoodRecordPostRequest`. */
    function isRegisterRequest(obj: any): obj is RegisterRequest {
        return obj != null && typeof obj === 'object'
            && 'firstName' in obj && typeof obj.firstName === 'string'
            && 'lastName' in obj && typeof obj.lastName === 'string'
            && 'weight' in obj && typeof obj.weight === 'number'
            && 'email' in obj && typeof obj.email === 'string'
            && 'password' in obj && typeof obj.password === 'string'
    }

    return async (req: Request, res: Response) => {
        let response: RegisterResponse = { error: RegisterError.Ok }

        try {
            if (!isRegisterRequest(req.body)) {
                response.error = RegisterError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { firstName, lastName, weight, email, password } = req.body

            const db = client.db()
            await db.collection('Users')
                .insertOne({ firstName, lastName, weight, email, password })

        } catch (e) {
            if ((e as WriteError).code === 11000) {
                response.error = RegisterError.ExistingUser
            } else {
                response.error = RegisterError.ServerError
                console.log(e)
            }
        }

        res.status(200).json(response)
    }
}

