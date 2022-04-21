import { RequestHandler, Request, Response, Express, query } from 'express'
import { MongoClient, WriteError } from 'mongodb'
import { isObjectIdString, ObjectIdString } from '../global-types'
var token = require('../createJWT');

export enum LoginError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    InvalidCredentials,
    emailVerification,
    jwtError
}

export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = {
    userId: ObjectIdString
    firstname: string
    lastname: string
    weight: number
    email: string
    error: LoginError
    jwtToken: any
}

/* Returns a function of type `RequestHandler` to be used in a route. */
export function login(app: Express, client: MongoClient): RequestHandler {

    function isLoginRequest(obj: any): obj is LoginRequest {
        return obj != null && typeof obj === 'object'
            && 'email' in obj && typeof obj.email === 'string'
            && 'password' in obj && typeof obj.password === 'string'
    }

    return async (req: Request, res: Response) => {

        let response: LoginResponse = { userId: '', firstname: '', lastname: '', weight: 0, error: LoginError.Ok, jwtToken: null, email: ''}

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
                if(!queryResults[0].hasVerifiedEmail){
                    response.error = LoginError.emailVerification
                    res.status(200).json(response)
                    return
                }

                response = {
                    userId: queryResults[0]._id.toString(),
                    firstname: queryResults[0].firstname,
                    lastname: queryResults[0].lastname,
                    weight: queryResults[0].weight,
                    email: queryResults[0].email,
                    error: LoginError.Ok,
                    jwtToken: null
                }

                const tokenResult = token.createToken( response.firstname, response.lastname, response.userId );
                
                if(tokenResult.error){
                    response.error = LoginError.jwtError;
                } else {
                    response.jwtToken = tokenResult.accessToken;
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
