import { RequestHandler, Request, Response, Express, query } from 'express'
import { MongoClient, WriteError } from 'mongodb'
import { isObjectIdString, ObjectIdString } from '../global-types'

export enum LoginError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    InvalidCredentials,
}

export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = {
    userId: ObjectIdString
    firstname: string
    lastname: string
    error: LoginError
}

/* Returns a function of type `RequestHandler` to be used in a route. */
export function login(app: Express, client: MongoClient): RequestHandler {

    function isLoginRequest(obj: any): obj is LoginRequest {
        return obj != null && typeof obj === 'object'
            && 'email' in obj && typeof obj.email === 'string'
            && 'password' in obj && typeof obj.password === 'string'
    }

    return async (req: Request, res: Response) => {

        let response: LoginResponse = { userId: '', firstname: '', lastname: '', error: LoginError.Ok }

        try {

            if (!isLoginRequest(req.body)) {
                response.error = LoginError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { email, password } = req.body
            const db = client.db()
            const queryResults = await db
                .collection('Users')
                .find({ email, password })
                .toArray()

            if (queryResults.length > 0) {
                response = {
                    userId: queryResults[0]._id.toString(),
                    firstname: queryResults[0].firstname,
                    lastname: queryResults[0].lastname,
                    error: LoginError.Ok
                }
                res.status(200).json(response)
                return
            } else {
                response.error = LoginError.InvalidCredentials
                res.json(response)
                return
            }
        } catch (e) {
            console.log(e)
            response.error = LoginError.ServerError,
            res.status(200).json(response)
        }

    }
}
