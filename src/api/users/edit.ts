import { RequestHandler, Request, Response, Express, query } from 'express'
import { MongoClient, WriteError, ObjectId, Timestamp } from 'mongodb'
import { isObjectIdString, ObjectIdString } from '../global-types'
var token = require('../createJWT');


////////////////////////////////////////
// POST (Edit user password)
////////////////////////////////////////

export enum EditPasswordError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    InvalidCredentials,
    jwtError
}

export type EditPasswordRequest = {
    userId: ObjectIdString
    oldPassword: string
    newPassword: string
    jwtToken: any
}

export type EditPasswordResponse = {
    error: EditPasswordError
    jwtToken: any
}

export function editPassword(app: Express, client: MongoClient): RequestHandler {

    function isEditPasswordRequest(obj: any): obj is EditPasswordRequest {
        return obj != null && typeof obj === 'object'
            && 'userId' in obj && isObjectIdString(obj.userId)
            && 'oldPassword' in obj && typeof obj.oldPassword === 'string'
            && 'newPassword' in obj && typeof obj.newPassword === 'string'
            && 'jwtToken' in obj && obj.jwtToken != null
    }

    return async (req: Request, res: Response) => {

        let response: EditPasswordResponse = { error: EditPasswordError.Ok, jwtToken: null }

        try {

            if (!isEditPasswordRequest(req.body)) {
                response.error = EditPasswordError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { userId, newPassword, oldPassword, jwtToken } = req.body

            if (token.isExpired(jwtToken)) {
                response.error = EditPasswordError.jwtError;
                response.jwtToken = null;
                res.status(200).json(response);
                return;
            } else {
                response.jwtToken = jwtToken
            }

            const db = client.db()
            const queryResults = await db
                .collection('Users')
                .updateOne({ '_id': new ObjectId(userId), 'password': oldPassword }, {
                    $set: {
                        'password': newPassword,
                    }
                })

            if (queryResults.modifiedCount != 1) {
                response.error = EditPasswordError.InvalidCredentials
                response.jwtToken = null
                res.json(response)
                return
            }
        } catch (e) {
            console.log(e)
            response.error = EditPasswordError.ServerError
            response.jwtToken = null
            res.status(200).json(response)
        }

        try {
            const jwtRefresh = token.refresh(response.jwtToken);
            response.jwtToken = jwtRefresh.accessToken

            if (jwtRefresh.error) {
                response.jwtToken = null
                response.error = EditPasswordError.jwtError
            }

        }
        catch (e) {
            response.jwtToken = null
            response.error = EditPasswordError.jwtError
        }

        //refresh token
        res.status(200).json(response)
        return
    }
}


////////////////////////////////////////
// POST (Edit user account)
////////////////////////////////////////

export enum EditError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    InvalidCredentials,
    jwtError
}

export type EditRequest = {
    userId: ObjectIdString
    firstname: string
    lastname: string
    email: string
    weight: number
    jwtToken: any
}

export type EditResponse = {
    error: EditError
    jwtToken: any
}

/* Returns a function of type `RequestHandler` to be used in a route. */
export function edit(app: Express, client: MongoClient): RequestHandler {

    function isEditRequest(obj: any): obj is EditRequest {
        return obj != null && typeof obj === 'object'
            && 'userId' in obj && isObjectIdString(obj.userId)
            && 'firstname' in obj && typeof obj.firstname === 'string'
            && 'lastname' in obj && typeof obj.lastname === 'string'
            && 'email' in obj && typeof obj.email === 'string'
            && 'weight' in obj && typeof obj.weight === 'number'
            && 'jwtToken' in obj && obj.jwtToken != null
    }

    return async (req: Request, res: Response) => {

        let response: EditResponse = { error: EditError.Ok, jwtToken: null }

        try {

            if (!isEditRequest(req.body)) {
                response.error = EditError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { userId, firstname: firstname, lastname: lastname, email, weight, jwtToken } = req.body

            if (token.isExpired(jwtToken)) {
                response.error = EditError.jwtError;
                response.jwtToken = null;
                res.status(200).json(response);
                return;
            } else {
                response.jwtToken = jwtToken
            }

            const db = client.db()
            const queryResults = await db
                .collection('Users')
                .updateOne({ '_id': new ObjectId(userId), 'email': email }, {
                    $set: {
                        'firstname': firstname,
                        'lastname': lastname,
                        'weight': weight
                    }
                })

            if (queryResults.modifiedCount != 1) {
                response.error = EditError.InvalidCredentials
                response.jwtToken = null
                res.json(response)
                return
            }
        } catch (e) {
            console.log(e)
            response.error = EditError.ServerError
            response.jwtToken = null
            res.status(200).json(response)
        }

        try {
            const jwtRefresh = token.refresh(response.jwtToken);
            response.jwtToken = jwtRefresh.accessToken

            if (jwtRefresh.error) {
                response.jwtToken = null
                response.error = EditError.jwtError
            }

        }
        catch (e) {
            response.jwtToken = null
            response.error = EditError.jwtError
        }

        //refresh token
        res.status(200).json(response)
        return
    }
}
