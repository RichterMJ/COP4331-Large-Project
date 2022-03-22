import { RequestHandler, Request, Response, Express, query } from 'express'
import { MongoClient, ObjectId, Timestamp } from 'mongodb'
import {
    ObjectIdString, isObjectIdString,
    IsoDate, isIsoDate,
    IsoTimestamp, isIsoTimestamp,
    FoodRecord, isFoodRecord,
    Nutrient, isNutrient,
    Portion, isPortion,
    AmountConsumed, isAmountConsumed, Food, isFood,
} from '../../global-types'


export enum verifyEmailError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    InvalidCredentials
}

export type verifyEmailRequest = {
    userId: ObjectIdString
}

export type verifyEmailResponse = {
    error: verifyEmailError
}


export function verifyEmail(app: Express, client: MongoClient): RequestHandler {

    /* Programmatically ensure the request body is of type `verifyEmailRequest`. */
    function isVerifyEmailRequest(obj: any): obj is verifyEmailRequest {
        return obj != null && typeof obj === 'object'
        && 'userId' in obj && isObjectIdString(obj.userId)
    }

    return async (req: Request, res: Response) => {
        let response: verifyEmailResponse = { error: 0 }
        try {
            if (!isVerifyEmailRequest(req.body)) {
                response.error = verifyEmailError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { userId } = req.body
            /*
            if(userId != null && typeof userId === 'string'){
                // Go to the data base and update
                const db = client.db()

                const result = await db.collection('Users').updateOne(
                        {'_id': new ObjectId(userId)},
                        {
                            $set: {hasVerifiedEmail: true}
                        }
                    )
            
                if(result.modifiedCount != 1){
                    response.error = verifyEmailError.InvalidCredentials
                }
            } else {
                response.error = verifyEmailError.InvalidRequest
                res.status(200).json(response)
                return
            }

            */

            // Go to the data base and update
            const db = client.db()

            let result = await db.collection('Users').updateOne(
                    {'_id': new ObjectId(userId)},
                    {
                        $set: {hasVerifiedEmail: true}
                    }
            )
        
            if(result.modifiedCount != 1){
                response.error = verifyEmailError.InvalidCredentials
            }
           
        } catch (e) {
            response.error = verifyEmailError.ServerError
            console.log(e)
        }

        res.status(200).json(response)
    }
}
