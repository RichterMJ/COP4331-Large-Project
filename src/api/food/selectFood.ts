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

export type ConsumedAmount = {
    portionId: number,
    quantity: number
}

export type Food = {
  fdcId : number
  description: string
  foodNutrients: Nutrient[] 
  foodPortions: Portion[] | null
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
  }

  // only keep wanted nutrients
  let requiredNutrients = [1106, 1109, 1114, 1124, 1162, 1165, 1166, 1167, 1174, 1175, 1176, 1177, 1178,
    1180, 1183, 1184, 1185, 1187,1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 
    1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1141, 1142, 1149, 1213, 
    1214, 1215, 1216, 1217, 1218, 1219, 1220, 1221, 1222, 1223, 1224, 1225, 1226, 
    1227, 1232, 1233, 1234, 1003, 1004, 1005, 1009, 1010, 1011, 1012, 1013, 1050, 
    1063, 1257, 1258, 1291, 1292, 1293, 2047, 2048] 

  converted.foodNutrients.forEach((nutrient: Nutrient) => {
    let id = nutrient.nutrientId;

    let i = requiredNutrients.indexOf(id);
    if (i < 0) {
      converted.foodNutrients.splice(i, 1);
    }
  });

  return converted
}

/* Returns a function of type `RequestHandler` to be used in a route. */
export function SelectFood(app: Express, client: MongoClient): RequestHandler {
  return async (req: Request, res: Response) => {
    let response: SelectFoodResponse = { food: null, jwtToken: null, error: SelectFoodError.Ok }

    try {
      const { fdcId, jwtToken } = req.body as SelectFoodRequest
      const db = client.db()

      /* call api to get responses */

      let result = await axios.get(`https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${USDA_API_KEY}`);
      let SelectResults = result.data;

      // convert results

      let item = convertUsdaFood(SelectResults);

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
/*
vitaminNumbers: []int{},
		mineralNumbers: []int{},
		aminoNumbers:   []int{},
		macroNumbers:   []int{},
*/


