import { RequestHandler, Request, Response, Express, query } from 'express'
import { MongoClient, ObjectId, Timestamp } from 'mongodb'
var token = require('../../createJWT');
import {
    ObjectIdString, isObjectIdString,
    IsoDate, isIsoDate,
    IsoTimestamp, isIsoTimestamp,
    FoodRecord, isFoodRecord,
    Nutrient, isNutrient,
    Portion, isPortion,
    AmountConsumed, isAmountConsumed, Food, isFood,
} from '../../global-types'


////////////////////////////////////////
// POST
////////////////////////////////////////

export enum FoodRecordPostError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    jwtError
}

export type FoodRecordPostRequest = {
    food: Food
    userId: ObjectIdString
    eatenTimestamp: IsoTimestamp
    amountConsumed: AmountConsumed
    jwtToken: any
}

export type FoodRecordPostResponse = {
    foodRecordId: ObjectIdString | null
    error: FoodRecordPostError
    jwtToken: any
}

function getTotalNutrients(food: Food, consumed: AmountConsumed): Nutrient[] {
    // @ts-ignore

    const keepOnlyNutrients = [
        1106, 1109, 1114, 1124, 1162, 1165, 1166, 1167, 1174, 1175, 1176, 1177, 1178,
        1180, 1183, 1184, 1185, 1187, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094,
        1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1141, 1142, 1149, 1213,
        1214, 1215, 1216, 1217, 1218, 1219, 1220, 1221, 1222, 1223, 1224, 1225, 1226,
        1227, 1232, 1233, 1234, 1003, 1004, 1005, 1009, 1010, 1011, 1012, 1013, 1050,
        1063, 1257, 1258, 1291, 1292, 1293, 2047, 2048
    ]

    let totalNutrients: Nutrient[] = [];

    const foodPortion = consumed.portion;
    food.nutrients.forEach((curNutrient: Nutrient) => {
        if (keepOnlyNutrients.indexOf(curNutrient.nutrientId) != -1) {
            const temp = {
                nutrientId: curNutrient.nutrientId,
                nutrientName: curNutrient.nutrientName,
                unitName: curNutrient.unitName,
                value: (consumed.quantity * curNutrient.value * foodPortion.gramAmount) / 100
            }
            totalNutrients.push(temp);
        }
    });

    return totalNutrients
}


export function foodRecordsPost(app: Express, client: MongoClient): RequestHandler {

    /* Programmatically ensure the request body is of type `FoodRecordPostRequest`. */
    function isFoodRecordPostRequest(obj: any): obj is FoodRecordPostRequest {
        return obj != null && typeof obj === 'object'
            && 'food' in obj && isFood(obj.food)
            && 'userId' in obj && isObjectIdString(obj.userId)
            && 'eatenTimestamp' in obj && isIsoDate(obj.eatenTimestamp)
            && 'amountConsumed' in obj && isAmountConsumed(obj.amountConsumed)
            && 'jwtToken' in obj && obj.jwtToken != null
    }

    return async (req: Request, res: Response) => {
        let response: FoodRecordPostResponse = { foodRecordId: null, error: 0, jwtToken: null }
        try {
            if (!isFoodRecordPostRequest(req.body)) {
                response.error = FoodRecordPostError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { food, userId, eatenTimestamp, amountConsumed, jwtToken } = req.body

            if( token.isExpired(jwtToken))
            {
                response.jwtToken = null;
                response.error = FoodRecordPostError.jwtError
                res.status(200).json(response);
                return;
            } else { 
                response.jwtToken = jwtToken;
            }

            // Hack to ensure that parsing via `new Date(..)` yields the correct date.
            const startDate: string = eatenTimestamp + 'T23:59:59Z'

            // Create `_startDate` as a date object, truncating time.
            // Create `_endDate` as a date object one day ahead, truncating time.
            const _startDate = new Date(new Date(startDate).toDateString())

            const foodRecord: FoodRecord = {
                userId,
                creationTimestamp: new Date(),
                eatenTimestamp: _startDate,
                food,
                amountConsumed,
                totalNutrients: getTotalNutrients(food, amountConsumed),
            }

            const db = client.db()
            const queryResult = await db.collection('FoodRecords').insertOne(foodRecord)

            if (queryResult.acknowledged && queryResult.insertedId != null) {
                response.foodRecordId = queryResult.insertedId.toString()
            } else {
                response.error = FoodRecordPostError.ServerError
                response.foodRecordId = null
                response.jwtToken = null;
                res.status(200).json(response);
                return;
            }

        } catch (e) {
            response.error = FoodRecordPostError.ServerError
            console.log(e)
            response.foodRecordId = null
            response.jwtToken = null;
            res.status(200).json(response);
            return;
        }


        try
        {
          const jwtRefresh = token.refresh(response.jwtToken);
          response.jwtToken = jwtRefresh.accessToken
    
          if(jwtRefresh.error){
            response.jwtToken = null
            response.foodRecordId = null
            response.error = FoodRecordPostError.jwtError
          }
    
        }
        catch(e)
        {
          response.jwtToken = null
          response.foodRecordId = null
          response.error = FoodRecordPostError.jwtError
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
    jwtError
}

export type FoodRecordGetRequest =
    {
        userId: ObjectIdString
        foodRecordId: ObjectIdString
        jwtToken: any
    } | {
        userId: ObjectIdString
        startDate: IsoDate
        endDate: IsoDate
        jwtToken: any
    }

export type FoodRecordGetResponse = {
    foodRecords: FoodRecord[]
    error: FoodRecordGetError
    jwtToken: any
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
            userId: queryResult.userId,
            creationTimestamp: queryResult.creationTimestamp,
            eatenTimestamp: queryResult.eatenTimestamp,
            amountConsumed: queryResult.amountConsumed,
            food: queryResult.food,
            totalNutrients: queryResult.totalNutrients,
        }

        return converted
    }

    return async (req: Request, res: Response) => {

        let response: FoodRecordGetResponse = { foodRecords: [], error: 0, jwtToken: null }

        const paramFoodRecordId = req.query.foodRecordId ?? req.body.startDate
        const paramStartDate = req.query.startDate ?? req.body.startDate
        const paramEndDate = req.query.endDate ?? req.body.endDate
        const paramUserId = req.params.userId ?? req.query.userId ?? req.body.userId
        const jwtToken = req.query.jwtToken ?? req.body.jwtToken

        try {
            const db = client.db()

            if(token.isExpired(jwtToken))
            {
                response.jwtToken = null;
                response.error = FoodRecordGetError.jwtError
                response.foodRecords = []
                res.status(200).json(response);
                return;
            } else { 
                response.jwtToken = jwtToken;
            }

            if (paramFoodRecordId != null) {

                // API search via ID.

                if (!isObjectIdString(paramFoodRecordId) || !isObjectIdString(paramUserId)) {
                    response.error = FoodRecordGetError.InvalidRequest
                    response.jwtToken = null;
                    response.foodRecords = []
                    res.status(200).json(response)
                    return
                }

                const foodRecordId = paramFoodRecordId

                const queryResults = await db.collection('FoodRecords').find({
                    '_id': new ObjectId(foodRecordId),
                    userId: paramUserId
                }).toArray()

                response.foodRecords = queryResults.map(convertQueryResultToFoodRecord)

            } else {

                // API search via date range.

                if (!isIsoDate(paramStartDate) || !isIsoDate(paramEndDate) || !isObjectIdString(paramUserId)) {
                    response.error = FoodRecordGetError.InvalidRequest
                    response.foodRecords = []
                    response.jwtToken = null;
                    res.status(200).json(response)
                    return
                }

                // Check if the end date is before the start date
                const actualStartDate = new Date(new Date(paramStartDate).toDateString());
                const actualEndDate = new Date(new Date(paramEndDate).toDateString());
                if((actualEndDate.valueOf() - actualStartDate.valueOf()) < 0){
                    response.error = FoodRecordGetError.InvalidRange
                    response.foodRecords = []
                    response.jwtToken = null;
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
                    userId: paramUserId,
                    'eatenTimestamp': {
                        $gte: _startDate,
                        $lt: _endDate
                    }
                }).toArray()

                response.foodRecords = queryResults.map(convertQueryResultToFoodRecord)
                
            }

        } catch (e) {
            response.error = FoodRecordGetError.ServerError
            response.foodRecords = []
            response.jwtToken = null;
            console.log(e)
            res.status(200).json(response)
            return
        }

        try
        {
          const jwtRefresh = token.refresh(response.jwtToken);
          response.jwtToken = jwtRefresh.accessToken
    
          if(jwtRefresh.error){
            response.jwtToken = null
            response.foodRecords = []
            response.error = FoodRecordGetError.jwtError
          }
    
        }
        catch(e)
        {
          response.jwtToken = null
          response.foodRecords = []
          response.error = FoodRecordGetError.jwtError
        }

        res.status(200).json(response)
        return
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
    jwtError
}

export type FoodRecordPutRequest = FoodRecord & { foodRecordId: ObjectIdString, jwtToken: any }

export type FoodRecordPutResponse = {
    error: FoodRecordPutError
    jwtToken: any
}

export function foodRecordsPut(app: Express, client: MongoClient): RequestHandler {

    /* Programmatically ensure the request body is of type `FoodRecordPutRequest`. */
    function isFoodRecordPutRequest(obj: any): obj is FoodRecordPutRequest {
        return obj != null && typeof obj === 'object'
                && 'jwtToken' in obj && obj.jwtToken != null
                && isFoodRecord(obj)
                && 'foodRecordId' in obj && isObjectIdString(obj.foodRecordId)
    }

    return async (req: Request, res: Response) => {

        let response: FoodRecordPutResponse = { error: 0, jwtToken: null }

        try {
            if (!isFoodRecordPutRequest(req.body)) {
                response.error = FoodRecordPutError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { foodRecordId, totalNutrients, creationTimestamp, eatenTimestamp, amountConsumed, userId, food, jwtToken } = req.body
            const update: FoodRecord = { totalNutrients, creationTimestamp, eatenTimestamp, amountConsumed, userId, food }
            update.totalNutrients = getTotalNutrients(food, amountConsumed)

            if( token.isExpired(jwtToken))
            {
                response.jwtToken = null;
                response.error = FoodRecordPutError.jwtError
                res.status(200).json(response);
                return;
            } else { 
                response.jwtToken = jwtToken;
            }

            const db = client.db()
            const queryResult = await db.collection('FoodRecords').replaceOne(
                { "_id": new ObjectId(foodRecordId) },
                update
            )

            // If the query was acknowledged and there were no modifications, then the id was bad.
            if (queryResult.modifiedCount === 0 && queryResult.acknowledged) {
                response.error = FoodRecordPutError.InvalidId
                response.jwtToken = null;
                res.status(200).json(response);
                return;
            }
        } catch (e) {
            response.error = FoodRecordPutError.ServerError
            console.log(e)
            response.jwtToken = null;
            res.status(200).json(response);
            return;
        }

        try
        {
          const jwtRefresh = token.refresh(response.jwtToken);
          response.jwtToken = jwtRefresh.accessToken
    
          if(jwtRefresh.error){
            response.jwtToken = null
            response.error = FoodRecordPutError.jwtError
          }
    
        }
        catch(e)
        {
          response.jwtToken = null
          response.error = FoodRecordPutError.jwtError
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
    jwtError
}

export type FoodRecordDeleteRequest = {
    foodRecordId: ObjectIdString
    jwtToken: any
}

export type FoodRecordDeleteResponse = {
    error: FoodRecordDeleteError
    jwtToken: any
}

export function foodRecordsDelete(app: Express, client: MongoClient): RequestHandler {

    function isFoodRecordDeleteRequest(obj: any): obj is FoodRecordDeleteRequest {
        return obj != null && typeof obj === 'object'
            && 'foodRecordId' in obj && isObjectIdString(obj.foodRecordId)
            && 'jwtToken' in obj && obj.jwtToken != null
    }

    return async (req: Request, res: Response) => {
        let response: FoodRecordDeleteResponse = { error: 0, jwtToken: null }

        try {
            if (!isFoodRecordDeleteRequest(req.body)) {
                response.error = FoodRecordDeleteError.InvalidRequest
                res.status(200).json(response)
                return
            }
        
            const { foodRecordId, jwtToken } = req.body

            if(token.isExpired(jwtToken))
            {
                response.jwtToken = null;
                response.error = FoodRecordDeleteError.jwtError
                res.status(200).json(response);
                return;
            } else { 
                response.jwtToken = jwtToken;
            }

            const db = client.db()
            const queryResult = await db
                .collection('FoodRecords')
                .deleteOne({ "_id": new ObjectId(foodRecordId) })

            // If the query was acknowledged and there were no modifications, then the id was bad.
            if (queryResult.deletedCount === 0 && queryResult.acknowledged) {
                response.error = FoodRecordDeleteError.InvalidId
                response.jwtToken = null;
                res.status(200).json(response);
                return;
            }
        } catch (e) {
            response.error = FoodRecordDeleteError.ServerError
            response.jwtToken = null;
            console.log(e)
            res.status(200).json(response);
            return;
        }

        try
        {
          const jwtRefresh = token.refresh(response.jwtToken);
          response.jwtToken = jwtRefresh.accessToken
    
          if(jwtRefresh.error){
            response.jwtToken = null
            response.error = FoodRecordDeleteError.jwtError
          }
    
        }
        catch(e)
        {
          response.jwtToken = null
          response.error = FoodRecordDeleteError.jwtError
        }

    res.status(200).json(response)
    return
    }
}


