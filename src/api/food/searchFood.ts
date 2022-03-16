import { RequestHandler, Request, Response, Express } from "express";
import { MongoClient } from "mongodb";

export enum SearchFoodError {
  Ok = "",
  ServerError,
}

export type SearchFoodRequest = {
  query: string;
  pageSize: string;
  start: string;
};

export type Nutrient = {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: number;
  unitName: string;
  value: number;
  foodNutrientId: number;
};

export type Food = {
  fdcId: number;
  description: string;
  usdaId: string;
  foodNutrients: Nutrient[];
};

export type SearchFoodResponse = {
  currentPage: number;
  foods?: Food[];
  error: SearchFoodError;
};

/* Returns a function of type `RequestHandler` to be used in a route. */
export function register(app: Express, client: MongoClient): RequestHandler {
  return async (req: Request, res: Response) => {
    let response: SearchFoodResponse = {
      response: null,
      error: SearchFoodError.Ok,
    };

    try {
      const { query, pageSize, start } = req.body as SearchFoodRequest;
      const db = client.db();

      /* call api to get responses */
    } catch (e) {
      response = {
        response: null,
        error: SearchFoodError.ServerError,
      };
    }

    res.status(200).json(response);
  };
}
