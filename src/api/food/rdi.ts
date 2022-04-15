import { RequestHandler, Request, Response, Express } from 'express'
import { MongoClient } from 'mongodb'
import { Nutrient } from '../global-types'
import { RDI_CHART } from './rdi-data'


export type RdiRequest = {}

export type RdiResponse = Nutrient[]

/* Returns a function of type `RequestHandler` to be used in a route. */
export function rdi(app: Express, client: MongoClient): RequestHandler {
  return async (req: Request, res: Response) => {
    res.status(200).json(RDI_CHART)
  }
}
