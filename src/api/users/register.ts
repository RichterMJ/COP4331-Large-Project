import { RequestHandler, Request, Response, Express } from 'express'
import { MongoClient, WriteError } from 'mongodb'
import { ObjectIdString, User } from '../global-types'

export enum RegisterError {
  Ok = 0,
  InvalidRequest,
  ServerError,
  ExistingUser,
}

export type RegisterRequest = {
  firstname: string
  lastname: string
  email: string
  password: string
  weight: number
}

export type RegisterResponse = {
  userId: ObjectIdString
  error: RegisterError
}

/* Returns a function of type `RequestHandler` to be used in a route. */

export function register(app: Express, client: MongoClient): RequestHandler {

  function isRegisterRequest(obj: any): obj is RegisterRequest {
    return obj != null && typeof obj === 'object'
      && 'firstname' in obj && typeof obj.firstname === 'string'
      && 'lastname' in obj && typeof obj.lastname === 'string'
      && 'weight' in obj && typeof obj.weight === 'number'
      && 'email' in obj && typeof obj.email === 'string'
      && 'password' in obj && typeof obj.password === 'string'
  }

  return async (req: Request, res: Response) => {
    let response: RegisterResponse = { userId: '', error: RegisterError.Ok }

    try {

      if (!isRegisterRequest(req.body)) {
        response.error = RegisterError.InvalidRequest
        res.status(200).json(response)
        return
      }

      const { firstname, lastname, weight, email, password } = req.body
      const user: User = { firstname, lastname, weight, email, password, hasVerifiedEmail: false }

      const db = client.db()
      const queryResult = await db
        .collection('Users')
        .insertOne(user)
      
      response.userId = queryResult.insertedId.toString()
      console.log(response);
      res.status(200).json(response)
      return

    } catch (e) {
      if ((e as WriteError).code === 11000) {
        response.error = RegisterError.ExistingUser
        res.status(200).json(response)
        return
      } else {
        response.error = RegisterError.ServerError
        res.status(200).json(response)
        return
      }
    }
  }
}

