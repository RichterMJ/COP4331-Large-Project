import { RequestHandler, Request, Response, Express } from 'express'
import { MongoClient } from 'mongodb'
import { fetch } from 'node-fetch';
import axios from 'axios';
import internal from 'stream';
import { USDA_API_KEY } from '../../index';

var token = require('./createJWT.js');
var storage = require('../tokenStorage.js');

export enum SelectFoodError {
    Ok = 0,
    ServerError
}

export type SelectFoodRequest = {
    fdcId: number
}

export type SelectFoodResponse {
    currentPage : number;
    foods: Food[] | null
    error: SelectFoodError
    jwtToken: any
}

export type Nutrient = {
    nutrientId: number
    nutrientName: string
    nutrientNumber : number
    unitName: string
    value: number 
    foodNutrientId: number
}
/*
export type Measure = {
    measureName: string
    gramWeight: number
}
*/

export type Food = {
    fdcId : number
    description: string
    usdaId: string
    foodNutrients: Nutrient[]
    foodMeasures: Measure[]
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

/*
function convertUsdaMeasure(measure: any): Measure {
    // @ts-ignore
    const converted = {
        measureName = measure.disseminationText,
        gramWeight: measure.gramWeight,
    }

    return converted
}
*/

function convertUsdaFood(food: any): Food {
    // @ts-ignore
    const converted = {
        usdaId: food.fdcId,
        usdaName: food.description,
        nutrients: food.foodNutrients.map(convertUsdaNutrient),
        //measures: food.foodMeasures.map(convertUsdaMeasure),
        dataSource: food.dataSource
    }

    return converted
}



/* Returns a function of type `RequestHandler` to be used in a route. */

//get food and add portion section to it later?
export function selectFood(app: Express, client: MongoClient): RequestHandler {
    return async (req: Request, res: Response) => {
        let response: SelectFoodResponse = { currentPage: 0, foods: null, error: SelectFoodError.Ok, jwtToken: null }

        try {
            const { query, pageSize, start } = req.body as SelectFoodRequest
            const db = client.db()

            /* call api to get responses */
            
            var body = {
                "query": `*${query}*`,
                "dataType": [
                "SR Legacy"
                ],
                "pageSize": pageSize,
                "pageNumber":start
            }

            /*

            var config = 
            {
                method: 'post',
                url: 'https://api.nal.usda.gov/fdc/v1/foods/search?api_key='.concat(USDA_API_KEY),	
                headers: 
                {
                    'Content-Type': 'application/json'
                },
                data: body
            };
            */

            let result = await axios.post(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}`, body);
            let SelectResults = result.data;

            //convert results

            response = {
                currentPage : start,
                foods : SelectResults.foods.map(convertUsdaFood),
                error : SelectFoodError.Ok,
                jwtToken : null
            }


        } catch (e) {
            response = {
                currentPage : 0,
                foods: null,
                error: SelectFoodError.ServerError,
                jwtToken: null
            }
        }

      var refreshedToken = null;
      try
      {
        refreshedToken = token.refresh(jwtToken);
        response.jwtToken = refreshedToken;
      }
      catch(e)
      {
        console.log(e.message);
      }

        res.status(200).json(response)
    }
}
