import { RequestHandler, Request, Response, Express } from 'express'
import { MongoClient } from 'mongodb'
import axios from 'axios';
import internal from 'stream';
import { USDA_API_KEY } from '../../index';

let token = require('./createJWT.js');
let storage = require('../tokenStorage.js');

export enum SelectFoodError {
    Ok = 0,
    ServerError
}

export type SelectFoodRequest = {
    fdcId: number,
    portionId: number,
    quantity: number,
    jwtToken: any
}

export type SelectFoodResponse = {
    food: Food | null
    jwtToken: any
    error: SelectFoodError
}

export type Nutrient = {
    nutrientId: number
    nutrientName: string
    nutrientNumber : number
    unitName: string
    value: number
    foodNutrientId: number
}

export type Portion = {
    id: number,
    PortionName: string,
    gramWeight: number
}

export type Consumed = {
    portionId: number,
    quantity: number
}

export type Food = {
    fdcId : number
    description: string
    foodNutrients: Nutrient[]
    foodPortions: Portion[] | null
    foodConsumed: Consumed | null
}


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

function convertUsdaPortion(Portion: any): Portion {
  // @ts-ignore
  const converted = {
    id: Portion.id,
    PortionName: Portion.disseminationText,
    gramWeight: Portion.gramWeight
  }

  return converted
}

function convertUsdaFood(food: any): Food {
  // @ts-ignore
  const converted = {
    fdcId: food.fdcId,
    description: food.description,
    foodNutrients: food.foodNutrients.map(convertUsdaNutrient),
    foodPortions: food.foodPortions.map(convertUsdaPortion),
    foodConsumed: null
  }

  return converted
}

/* Returns a function of type `RequestHandler` to be used in a route. */
export function SelectFood(app: Express, client: MongoClient): RequestHandler {
  return async (req: Request, res: Response) => {
    let response: SelectFoodResponse = { food: null, jwtToken: null, error: SelectFoodError.Ok }

    try {
      const { fdcId, portionId, quantity, jwtToken } = req.body as SelectFoodRequest
      const db = client.db()

      /* call api to get responses */

      let result = await axios.get(`https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${USDA_API_KEY}`);
      let SelectResults = result.data;

      // convert results

      let item = convertUsdaFood(SelectResults);
      let consumedAmount = {
        portionId: portionId,
        quantity: quantity
      }

      item.foodConsumed = consumedAmount;
      // get food consumed object
      response = {
        food: item,
        jwtToken: null,
        error: SelectFoodError.Ok
      }
    } catch (e) {
      response = {
        food: null,
        jwtToken: null,
        error: SelectFoodError.ServerError
      }
    }

    var refreshedToken = null;
    try
    {
      refreshedToken = token.refresh(jwtToken)
      response.jwtToken = refreshedToken
    }
    catch(e)
    {
      console.log(e.message);
    }

    res.status(200).json(response)
  }
}
