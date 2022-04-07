import { RequestHandler, Request, Response, Express } from 'express'
import { MongoClient } from 'mongodb'
import axios from 'axios';
import { USDA_API_KEY } from '../../index';
import { Food, Nutrient, Portion } from '../global-types';

var token = require('../createJWT');

// Possible TODO: Merge `searchFoodByName.ts` with `searchFoodById.ts` into one file `searchFood.ts`.
//                The reason is that a lot of functions (e.g., the `convertUsda..()` series) seem like
//                they're defined in both files.
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


export enum SearchFoodByNameError {
  Ok = 0,
  InvalidRequest,
  ServerError,
  jwtError
}

export type SearchFoodByNameRequest = {
  query: string
  pageSize: number,
  start: number,
  jwtToken: any
}

export type SearchFoodByNameResponse = {
  currentPage: number;
  foods: Food[]
  error: SearchFoodByNameError
  jwtToken: any
}

/* Returns a function of type `RequestHandler` to be used in a route. */
export function searchFoodByName(app: Express, client: MongoClient): RequestHandler {

  function isSearchFoodByNameRequest(obj: any): obj is SearchFoodByNameRequest {
    return obj != null && typeof obj === 'object'
      && 'query' in obj && typeof obj.query === 'string'
      && 'pageSize' in obj && typeof obj.pageSize === 'number'
      && 'start' in obj && typeof obj.start === 'number'
      && 'jwtToken' in obj && obj.jwtToken != null 
  }

  function convertDbRowToFood(dbRow: any): Food {
    const food: Food = {
      fdcId: dbRow.fdc_id ?? dbRow.fdcId,
      description: dbRow.description,
      nutrients: [],
      portions: []
    }

    return food
  }

  return async (req: Request, res: Response) => {
    let response: SearchFoodByNameResponse = { currentPage: 0, foods: [], error: SearchFoodByNameError.Ok, jwtToken: null }

    try {

      if (!isSearchFoodByNameRequest(req.body)) {
        response.error = SearchFoodByNameError.InvalidRequest
        res.status(200).json(response)
        return
      }

      const { query, pageSize, start, jwtToken } = req.body
      const db = client.db()

      if( token.isExpired(jwtToken))
      {
        response.jwtToken = null;
        response.error = SearchFoodByNameError.jwtError
        res.status(200).json(response);
        return;
      } else { 
        response.jwtToken = jwtToken;
      }

      // Old way of doing it, might revert idk.
      //const body = {
      //  query: `*${query}*`,
      //  dataType: [
      //    'SR Legacy'
      //  ],
      //  pageSize: pageSize,
      //  pageNumber: start
      //}

      //const queryResult = await axios.post(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}`, body);

      //response.foods = queryResult.data.foods.map(convertUsdaFood)

      const queryResponse = await db
        .collection('FoodFuzzySearch')
        .aggregate([
          {
            $search: {
              // Syntax is taken from: https://docs.atlas.mongodb.com/atlas-search/text/#fuzzy-examples
              text: {
                query: query,
                path: 'description',
                fuzzy: {}
              }
            }
          },
          {
            $limit: pageSize + pageSize * start
          }
        ])
        .toArray()

      console.log(queryResponse)

      response.foods = queryResponse.slice(pageSize * start, pageSize + pageSize * start).map(convertDbRowToFood)
      response.currentPage = start


    } catch (e) {
      console.log(e)
      response.error = SearchFoodByNameError.ServerError
      response.jwtToken = null
      response.currentPage = 0;
      response.foods = []
      res.status(200).json(response)
      return
    }

    try
    {
      const jwtRefresh = token.refresh(response.jwtToken);
      response.jwtToken = jwtRefresh.accessToken

      if(jwtRefresh.error){
        response.jwtToken = null
        response.currentPage = 0;
        response.foods = []
        response.error = SearchFoodByNameError.jwtError
      }

    }
    catch(e)
    {
      response.jwtToken = null
      response.currentPage = 0;
      response.foods = []
      response.error = SearchFoodByNameError.jwtError
    }

    res.status(200).json(response)
    return
  }
}
