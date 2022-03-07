import { RequestHandler, Request, Response, Express, query } from 'express'
import { MongoClient, WriteError } from 'mongodb'

export enum LoginError {
    Ok = 0,
    InvalidCredentials,
    ServerError
}

export type LoginRequest = {
    username: string
    password: string
}

export type LoginResponse = {
    userId: string
    firstname: string
    lastname: string
    error: LoginError
}

/* Returns a function of type `RequestHandler` to be used in a route. */
export function login(app: Express, client: MongoClient): RequestHandler {
    return async (req: Request, res: Response) => {

        let response: LoginResponse = { userId: '', firstname: '', lastname: '', error: LoginError.ServerError }

        try {
            const { username, password } = req.body as LoginRequest
            const db = client.db()
            const queryResults = await db
                .collection('Users')
                .find({ username, password })
                .toArray()

            if (queryResults.length > 0) {
                response.userId = queryResults[0]._id.toString()
                response.firstname = queryResults[0].firstname
                response.lastname = queryResults[0].lastname
                response.error = LoginError.Ok
            } else {
                response.error = LoginError.InvalidCredentials
            }
        } catch (e) {
            response = {
                userId: '',
                firstname: '',
                lastname: '',
                error: LoginError.ServerError
            }
        }

        res.status(200).json(response)
    }
}
