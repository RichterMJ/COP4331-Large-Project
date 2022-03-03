import { RequestHandler, Request, Response, Express, query } from 'express'
import { MongoClient } from 'mongodb'

export enum LoginErr {
    Ok = '',
    InvalidCredentials = 1,
    ServerError
}

export type LoginReq = {
    username: string
    password: string
}

export type LoginRes = {
    userId: string
    firstname: string
    lastname: string
    error: LoginErr
}

/* Returns a function of type `RequestHandler` to be used in a route. */
export function login(app: Express, client: MongoClient): RequestHandler {
    return async (req: Request, res: Response) => {

        let response: LoginRes = { userId: '', firstname: '', lastname: '', error: LoginErr.ServerError }

        try {
            const { username, password } = req.body as LoginReq
            const db = client.db()
            const queryResults = await db
                .collection('Users')
                .find({ username, password })
                .toArray()

            if (queryResults.length > 0) {
                response.userId = queryResults[0]._id.toString()
                response.firstname = queryResults[0].firstname
                response.lastname = queryResults[0].lastname
                response.error = LoginErr.Ok
            } else {
                response.error = LoginErr.InvalidCredentials
            }
        } catch (e) {
            response = {
                userId: '',
                firstname: '',
                lastname: '',
                error: LoginErr.ServerError
            }
        }

        res.status(200).json(response)
    }
}
