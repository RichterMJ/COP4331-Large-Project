import { RequestHandler, Request, Response, Express } from 'express'
import { MongoClient } from 'mongodb'
import axios from 'axios';
import { USDA_API_KEY } from '../../index';
import { Food, Nutrient, Portion } from '../global-types';

// Possible TODO: Merge `searchFoodByName.ts` with `searchFoodById.ts` into one file `searchFood.ts`.
//                The reason is that a lot of functions (e.g., the `convertUsda..()` series) seem like
//                they're defined in both files.

function convertUsdaNutrient(nutrient: any): Nutrient {
  // @ts-ignore
  const converted = {
    nutrientId: nutrient.nutrientId,
    nutrientName: nutrient.nutrientName,
    nutrientNumber: nutrient.nutrientNumber,
    unitName: nutrient.unitName,
    value: nutrient.value,
    foodNutrientId: nutrient.foodNutrientId
  }

  return converted
}

function convertUsdaPortion(portion: any): Portion {
  // @ts-ignore
  const converted = {
    portionId: portion.id,
    portionName: portion.disseminationText,
    gramAmount: portion.gramWeight
  }

  return converted
}

function convertUsdaFood(food: any): Food {
  // @ts-ignore
  //remove all non-necessary nutrients

  const converted = {
    fdcId: food.fdcId,
    description: food.description,
    nutrients: [],
    portions: [],
  }

  return converted
}


////////////////////////////////////////
// POST
////////////////////////////////////////

export enum SearchFoodByNameError {
  Ok = 0,
  InvalidRequest,
  ServerError,
}

export type SearchFoodByNameRequest = {
  query: string
  pageSize: number,
  start: number,
}

export type SearchFoodByNameResponse = {
  currentPage: number;
  foods: Food[]
  error: SearchFoodByNameError
}

/* Returns a function of type `RequestHandler` to be used in a route. */
export function searchFoodByName(app: Express, client: MongoClient): RequestHandler {

  function isSearchFoodByNameRequest(obj: any): obj is SearchFoodByNameRequest {
    return obj != null && typeof obj === 'object'
      && 'query' in obj && typeof obj.query === 'string'
      && 'pageSize' in obj && typeof obj.pageSize === 'number'
      && 'start' in obj && typeof obj.start === 'number'
  }

  return async (req: Request, res: Response) => {
    let response: SearchFoodByNameResponse = { currentPage: 0, foods: [], error: SearchFoodByNameError.Ok }

    try {

      if (!isSearchFoodByNameRequest(req.body)) {
        response.error = SearchFoodByNameError.InvalidRequest
        res.status(200).json(response)
        return
      }

      const { query, pageSize, start } = req.body
      const db = client.db()

      const body = {
        query: `*${query}*`,
        dataType: [
          'SR Legacy'
        ],
        pageSize: pageSize,
        pageNumber: start
      }

      const queryResult = await axios.post(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}`, body);

      response.foods = queryResult.data.foods.map(convertUsdaFood)
      response.currentPage = start
      res.status(200).json(response)
      return

    } catch (e) {


      console.log(e)
      response.error = SearchFoodByNameError.ServerError
      res.status(200).json(response)
      return
    }
  }
}
