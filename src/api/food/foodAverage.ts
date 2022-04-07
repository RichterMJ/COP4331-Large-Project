import { RequestHandler, Request, Response, Express, query } from 'express'
import { MongoClient, ObjectId, Timestamp } from 'mongodb'
import axios from 'axios';
var token = require('../createJWT');

import {
    ObjectIdString, isObjectIdString,
    IsoDate, isIsoDate,
    IsoTimestamp, isIsoTimestamp,
    FoodRecord, isFoodRecord,
    AmountConsumed, isAmountConsumed, Food, isFood, Nutrient, isNutrient
} from '../global-types'
import {URL} from '../../index'

export enum FoodAverageError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    InvalidRange,
    jwtError
}

export type FoodAverageRequest = {
    startDate: IsoDate
    endDate: IsoDate
    userId: ObjectIdString
    jwtToken: any
}

export type FoodAverageResponse = {
    
    averageNutrients: Nutrient[]
    error: FoodAverageError
    jwtToken: any
}


function getAverageForFoodRecords(result: FoodRecord[], startDate: IsoDate, endDate: IsoDate): Nutrient[] {
    // @ts-ignore

    const keepOnlyNutrients = [
        1106, 1109, 1114, 1124, 1162, 1165, 1166, 1167, 1174, 1175, 1176, 1177, 1178,
        1180, 1183, 1184, 1185, 1187, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094,
        1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1141, 1142, 1149, 1213,
        1214, 1215, 1216, 1217, 1218, 1219, 1220, 1221, 1222, 1223, 1224, 1225, 1226,
        1227, 1232, 1233, 1234, 1003, 1004, 1005, 1009, 1010, 1011, 1012, 1013, 1050,
        1063, 1257, 1258, 1291, 1292, 1293, 2047, 2048
    ]

    let avgNutrientsDict: any = {}
    for (const food of result) {
        for (const nutrient of food.totalNutrients) {
            if (nutrient.nutrientId in avgNutrientsDict) {
                avgNutrientsDict[nutrient.nutrientId].value += nutrient.value
            } else {
                avgNutrientsDict[nutrient.nutrientId] = nutrient
            }
        }
    }
    let avgNutrients: Nutrient[] = Object.values(avgNutrientsDict)

    // get distance between start and end inclusive
    var numDays = ((Date.parse(endDate) - Date.parse(startDate)) / (1000*3600*24)) + 1

    avgNutrients.map((curNutrient: Nutrient) => {
        curNutrient.value /= numDays
    })
    
    return avgNutrients
  }

export function foodAverage(app: Express, client: MongoClient): RequestHandler {

    /*

    const keepOnlyNutrients = [
    1106, 1109, 1114, 1124, 1162, 1165, 1166, 1167, 1174, 1175, 1176, 1177, 1178,
    1180, 1183, 1184, 1185, 1187, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094,
    1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1141, 1142, 1149, 1213,
    1214, 1215, 1216, 1217, 1218, 1219, 1220, 1221, 1222, 1223, 1224, 1225, 1226,
    1227, 1232, 1233, 1234, 1003, 1004, 1005, 1009, 1010, 1011, 1012, 1013, 1050,
    1063, 1257, 1258, 1291, 1292, 1293, 2047, 2048
    ]

    converted.nutrients = converted.nutrients
    .filter((nutrient: Nutrient) => keepOnlyNutrients.includes(nutrient.nutrientId))

    */

    return async (req: Request, res: Response) => {

        let response: FoodAverageResponse = { averageNutrients: [], error: 0, jwtToken: null }
        const {userId, startDate, endDate, jwtToken} = req.body


        try {

            if( token.isExpired(jwtToken))
            {
              response.jwtToken = null
              response.error = FoodAverageError.jwtError
              res.status(200).json(response);
              return;
            }
    

            const db = client.db()
            
            if (!isIsoDate(startDate) || !isIsoDate(endDate)) {
                response.error = FoodAverageError.InvalidRequest
                response.jwtToken = null
                res.status(200).json(response)
                return
            }  

            //call other function and get summation
            /*
            export type FoodRecordGetRequest = { foodRecordId: ObjectIdString } | {
                startDate: IsoDate
                endDate: IsoDate
            }
            */

            const result = await axios.get(`http://${URL}/api/users/data/foodRecords?userId=${userId}&startDate=${startDate}&endDate=${endDate}&jwtToken=${jwtToken}`);
            console.log(result.data)
            if(result.data.error){
                response.jwtToken = null
                response.averageNutrients = []
                response.error = result.data.error
                res.status(200).json(response)
                return
            }
            response.jwtToken = result.data.jwtToken
            const queryResults = result.data.foodRecords;
            response.averageNutrients = getAverageForFoodRecords(queryResults, startDate, endDate);
            
        } catch (e) {
            response.error = FoodAverageError.ServerError
            console.log(e)
            response.jwtToken = null
            response.averageNutrients = []
            res.status(200).json(response)
            return
        }

        try
        {
          const jwtRefresh = token.refresh(response.jwtToken);
          response.jwtToken = jwtRefresh.accessToken
    
          if(jwtRefresh.error){
            response.jwtToken = null
            response.averageNutrients = []
            response.error = FoodAverageError.jwtError
          }
    
        }
        catch(e)
        {
          response.jwtToken = null
          response.averageNutrients = []
          response.error = FoodAverageError.jwtError
        }

        res.status(200).json(response)
        return
    }
}