import { RequestHandler, Request, Response, Express, query } from 'express'
import { MongoClient, WriteError, ObjectId, Timestamp } from 'mongodb'
import { isObjectIdString, ObjectIdString } from '../global-types'
var token = require('../createJWT');

export enum EditError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    InvalidCredentials,
    jwtError
}

export type EditRequest = {
    userId: ObjectIdString
    firstName: string
    lastName: string
    email: string
    password: string
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
            && 'firstName' in obj && typeof obj.firstName === 'string'
            && 'lastName' in obj && typeof obj.lastName === 'string'
            && 'email' in obj && typeof obj.email === 'string'
            && 'password' in obj && typeof obj.password === 'string'
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

            const { userId, firstName, lastName, email, password, weight, jwtToken } = req.body

            if( token.isExpired(jwtToken))
            {
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
                    $set: { 'firstname': firstName,
                        'lastname': lastName,
                        'password': password,
                        'weight': weight}
                } )

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

        try
        {
          const jwtRefresh = token.refresh(response.jwtToken);
          response.jwtToken = jwtRefresh.accessToken
    
          if(jwtRefresh.error){
            response.jwtToken = null
            response.error = EditError.jwtError
          }
    
        }
        catch(e)
        {
          response.jwtToken = null
          response.error = EditError.jwtError
        }

        //refresh token
        res.status(200).json(response)
        return
    }
}
