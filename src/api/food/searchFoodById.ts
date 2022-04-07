import { RequestHandler, Request, Response, Express } from 'express'
import { MongoClient } from 'mongodb'
import axios from 'axios';
import { USDA_API_KEY } from '../../index';
import { Food, Nutrient, Portion } from '../global-types';
var token = require('../createJWT');

function convertUsdaNutrient(foodNutrient: any): Nutrient {
  // @ts-ignore
  const nutrient = foodNutrient.nutrient
  const converted = {
    nutrientId: nutrient.id,
    nutrientName: nutrient.name,
    unitName: nutrient.unitName,
    value: foodNutrient.amount,
  }

  return converted
}

function convertUsdaPortion(portion: any): Portion {
  // @ts-ignore
  const converted = {
    portionId: portion.id,
    portionName: portion.amount + " " + portion.modifier,
    gramAmount: portion.gramWeight
  }

  return converted
}

// Possible TODO: Map these to enums.
// IDs of only the nutrients we care about. For more info check out the API documentation from USDA.
const keepOnlyNutrients = [
  1106, 1109, 1114, 1124, 1162, 1165, 1166, 1167, 1174, 1175, 1176, 1177, 1178,
  1180, 1183, 1184, 1185, 1187, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094,
  1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1141, 1142, 1149, 1213,
  1214, 1215, 1216, 1217, 1218, 1219, 1220, 1221, 1222, 1223, 1224, 1225, 1226,
  1227, 1232, 1233, 1234, 1003, 1004, 1005, 1009, 1010, 1011, 1012, 1013, 1050,
  1063, 1257, 1258, 1291, 1292, 1293, 2047, 2048
]

function convertUsdaFood(food: any): Food {
  // @ts-ignore
  const converted = {
    fdcId: food.fdcId,
    description: food.description,
    nutrients: food.foodNutrients.map(convertUsdaNutrient),
    portions: food.foodPortions.map(convertUsdaPortion),
  }

  const standardPortion = {
    portionId: 0,
    portionName: "100g",
    gramAmount: 100
  }
  converted.portions.unshift(standardPortion);
  converted.nutrients = converted.nutrients.filter((nutrient: Nutrient) => keepOnlyNutrients.includes(nutrient.nutrientId))

  return converted
}


export enum SearchFoodByIdError {
  Ok = 0,
  InvalidRequest,
  ServerError,
  jwtError
}

export type SearchFoodByIdRequest = {
  fdcId: number,
  jwtToken: any
}

export type SearchFoodByIdResponse = {
  food: Food | null
  error: SearchFoodByIdError
  jwtToken: any
}

/* Returns a function of type `RequestHandler` to be used in a route. */
export function searchFoodById(app: Express, client: MongoClient): RequestHandler {

  function isSearchFoodByIdRequest(obj: any): obj is SearchFoodByIdRequest {
    return obj != null && typeof obj === 'object'
      && 'fdcId' in obj && typeof obj.fdcId === 'number'
      && 'jwtToken' in obj && obj.jwtToken != null
  }

  return async (req: Request, res: Response) => {
    let response: SearchFoodByIdResponse = { food: null, error: SearchFoodByIdError.Ok, jwtToken: null }

    try {

      if (!isSearchFoodByIdRequest(req.body)) {
        response.error = SearchFoodByIdError.InvalidRequest
        res.status(200).json(response)
        return
      }

      const { fdcId, jwtToken } = req.body

      if( token.isExpired(jwtToken))
      {
        response.error = SearchFoodByIdError.jwtError;
        response.jwtToken = null;
        res.status(200).json(response);
        return;
      } else { 
        response.jwtToken = jwtToken
      }

      const db = client.db()

      const result = await axios.get(`https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${USDA_API_KEY}`);
      const queryResults = result.data;
      response.food = convertUsdaFood(queryResults)
      

    } catch (e) {

      // TODO: Axios + USDA API seem to throw an error when search by invalid ID. Distinguish
      //       between actual ServerErrors and bad IDs.

      console.log(e)
      response.error = SearchFoodByIdError.ServerError
      response.food = null;
      response.jwtToken = null
      res.status(200).json(response)
      return
    }

    try
    {
      const jwtRefresh = token.refresh(response.jwtToken);
      response.jwtToken = jwtRefresh.accessToken

      if(jwtRefresh.error){
        response.jwtToken = null
        response.food = null
        response.error = SearchFoodByIdError.jwtError
      }

    }
    catch(e)
    {
      response.jwtToken = null
      response.food = null
      response.error = SearchFoodByIdError.jwtError
    }

    res.status(200).json(response)
    return
  }
}
