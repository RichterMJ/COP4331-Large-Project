import { RequestHandler, Request, Response, Express, query } from 'express'
import { MongoClient, ObjectId, Timestamp } from 'mongodb'
import {
    ObjectIdString, isObjectIdString,
    IsoDate, isIsoDate,
    IsoTimestamp, isIsoTimestamp,
    FoodRecord, isFoodRecord,
    Unit, isUnit,
} from '../../global-types'

// TODO Create a schema for the database.

////////////////////////////////////////
// POST
////////////////////////////////////////

export enum FoodRecordPostError {
    Ok = 0,
    InvalidRequest,
    ServerError,
}

export type FoodRecordPostRequest = {
    foodId: number
    eatenTimestamp: IsoTimestamp
    eatenAmount: number
    eatenUnit: Unit
}

export type FoodRecordPostResponse = {
    foodRecordId?: ObjectIdString
    error: FoodRecordPostError
}

export function foodRecordsPost(app: Express, client: MongoClient): RequestHandler {

    /* Programmatically ensure the request body is of type `FoodRecordPostRequest`. */
    function isFoodRecordPostRequest(obj: any): obj is FoodRecordPostRequest {
        return obj != null && typeof obj === 'object'
            && 'foodId' in obj && typeof obj.foodId === 'number'
            && 'eatenTimestamp' in obj && isIsoTimestamp(obj.eatenTimestamp)
            && 'eatenAmount' in obj && typeof obj.eatenAmount === 'number'
            && 'eatenUnit' in obj && isUnit(obj.eatenUnit)
    }

    return async (req: Request, res: Response) => {
        let response: FoodRecordPostResponse = { error: 0 }

        try {
            if (!isFoodRecordPostRequest(req.body)) {
                response.error = FoodRecordPostError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { foodId, eatenTimestamp, eatenAmount, eatenUnit } = req.body

            const foodRecord: FoodRecord = {
                creationTimestamp: new Date(),
                eatenTimestamp: new Date(eatenTimestamp),
                eatenAmount,
                eatenUnit,
                foodId,
            }

            const db = client.db()
            const queryResult = await db.collection('FoodRecords').insertOne(foodRecord)

            if (queryResult.acknowledged && queryResult.insertedId != null) {
                response.foodRecordId = queryResult.insertedId.toString()
            } else {
                response.error = FoodRecordPostError.ServerError
            }

        } catch (e) {
            response.error = FoodRecordPostError.ServerError
            console.log(e)
        }

        res.status(200).json(response)
    }
}


////////////////////////////////////////
// GET
////////////////////////////////////////

export enum FoodRecordGetError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    InvalidRange,
}

export type FoodRecordGetRequest = { foodRecordId: ObjectIdString } | {
    startDate: IsoDate
    endDate: IsoDate
}

export type FoodRecordGetResponse = {
    foodRecords: FoodRecord[]
    error: FoodRecordGetError
}

// Accepts request in body or URI as a query parameter.
// Precedence is undefined when it comes to:
// - Searches by URI vs body.
// - Searches by ID vs date range.
// Reason: The devs should always choose one or the other!
export function foodRecordsGet(app: Express, client: MongoClient): RequestHandler {

    // Trusty that the database output is correctly formatted.
    function convertQueryResultToFoodRecord(queryResult: any): FoodRecord {
        // @ts-ignore
        const converted = {
            foodRecordId: queryResult._id,
            creationTimestamp: queryResult.creationTimestamp,
            eatenTimestamp: queryResult.eatenTimestamp,
            eatenAmount: queryResult.eatenAmount,
            eatenUnit: queryResult.eatenUnit,
            foodId: queryResult.foodId
        }

        return converted
    }

    return async (req: Request, res: Response) => {

        let response: FoodRecordGetResponse = { foodRecords: [], error: 0 }

        const paramFoodRecordId = req.query.foodRecordId ?? req.body.startDate
        const paramStartDate = req.query.startDate ?? req.body.startDate
        const paramEndDate = req.query.startDate ?? req.body.startDate

        try {
            const db = client.db()
            
            if (paramFoodRecordId != null) {

                // API search via ID.
                
                if (!isObjectIdString(paramFoodRecordId)) {
                    response.error = FoodRecordGetError.InvalidRequest
                    res.status(200).json(response)
                    return
                }
                
                const foodRecordId = paramFoodRecordId

                const queryResults = await db.collection('FoodRecords').find({
                    "_id": new ObjectId(foodRecordId)
                }).toArray()

                response.foodRecords = queryResults.map(convertQueryResultToFoodRecord)

            } else {

                // API search via date range.

                if (!isIsoDate(paramStartDate) || !isIsoDate(paramEndDate)) {
                    response.error = FoodRecordGetError.InvalidRequest
                    res.status(200).json(response)
                    return
                }

                // Hack to ensure that parsing via `new Date(..)` yields the correct date.
                const startDate: string = paramStartDate + 'T23:59:59Z'
                const endDate: string = paramEndDate + 'T23:59:59Z'

                // Create `_startDate` as a date object, truncating time.
                // Create `_endDate` as a date object one day ahead, truncating time.
                const _startDate = new Date(new Date(startDate).toDateString())
                const _endDate = new Date(new Date(endDate).toDateString())
                _endDate.setDate(_endDate.getDate() + 1)

                const queryResults = await db.collection('FoodRecords').find({
                    eatenTimestamp: {
                        $gte: _startDate,
                        $lt: _endDate
                    }
                }).toArray()

                response.foodRecords = queryResults.map(convertQueryResultToFoodRecord)
            }

        } catch (e) {
            response.error = FoodRecordGetError.ServerError
            console.log(e)
        }

        res.status(200).json(response)
    }
}


////////////////////////////////////////
// PUT
////////////////////////////////////////

export enum FoodRecordPutError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    InvalidId,
}

export type FoodRecordPutRequest = { foodRecordId: ObjectIdString } & FoodRecord

export type FoodRecordPutResponse = {
    error: FoodRecordPutError
}

export function foodRecordsPut(app: Express, client: MongoClient): RequestHandler {

    /* Programmatically ensure the request body is of type `FoodRecordPutRequest`. */
    function isFoodRecordPutRequest(obj: any): obj is FoodRecordPutRequest {
        return isFoodRecord(obj)
            && 'foodRecordId' in obj && isObjectIdString(obj.foodRecordId)
    }

    return async (req: Request, res: Response) => {

        let response: FoodRecordPutResponse = { error: 0 }

        try {
            if (!isFoodRecordPutRequest(req.body)) {
                response.error = FoodRecordPutError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { foodRecordId, creationTimestamp, eatenTimestamp, eatenAmount, eatenUnit, foodId } = req.body
            const update: FoodRecord = { creationTimestamp, eatenTimestamp, eatenAmount, eatenUnit, foodId }

            const db = client.db()
            const queryResult = await db.collection('FoodRecords').replaceOne(
                { "_id": new ObjectId(foodRecordId) },
                update
            )

            // If the query was acknowledged and there were no modifications, then the id was bad.
            if (queryResult.modifiedCount === 0 && queryResult.acknowledged) {
                response.error = FoodRecordPutError.InvalidId
            }
        } catch (e) {
            response.error = FoodRecordPutError.ServerError
            console.log(e)
        }

        res.status(200).json(response)
    }
}


////////////////////////////////////////
// DELETE
////////////////////////////////////////

export enum FoodRecordDeleteError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    InvalidId,
}

export type FoodRecordDeleteRequest = {
    foodRecordId: ObjectIdString
}

export type FoodRecordDeleteResponse = {
    error: FoodRecordDeleteError
}

export function foodRecordsDelete(app: Express, client: MongoClient): RequestHandler {

    function isFoodRecordDeleteRequest(obj: any): obj is FoodRecordDeleteRequest {
        return obj != null && typeof obj === 'object'
            && 'foodRecordId' in obj && isObjectIdString(obj.foodRecordId)
    }

    return async (req: Request, res: Response) => {
        let response: FoodRecordDeleteResponse = { error: 0 }

        try {
            if (!isFoodRecordDeleteRequest(req.body)) {
                response.error = FoodRecordDeleteError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { foodRecordId } = req.body

            const db = client.db()
            const queryResult = await db
                .collection('FoodRecords')
                .deleteOne({ "_id": new ObjectId(foodRecordId) })

            // If the query was acknowledged and there were no modifications, then the id was bad.
            if (queryResult.deletedCount === 0 && queryResult.acknowledged) {
                response.error = FoodRecordDeleteError.InvalidId
            }
        } catch (e) {
            response.error = FoodRecordDeleteError.ServerError
            console.log(e)
        }

        res.status(200).json(response)
    }
}


