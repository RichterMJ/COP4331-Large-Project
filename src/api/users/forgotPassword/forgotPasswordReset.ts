import { RequestHandler, Request, Response, Express, query } from "express";
import { MongoClient, ObjectId, Timestamp } from "mongodb";
import {
  ObjectIdString,
  isObjectIdString,
  IsoDate,
  isIsoDate,
  IsoTimestamp,
  isIsoTimestamp,
  FoodRecord,
  isFoodRecord,
  Nutrient,
  isNutrient,
  Portion,
  isPortion,
  AmountConsumed,
  isAmountConsumed,
  Food,
  isFood,
} from "../../global-types";

export enum forgotPasswordResetError {
  Ok = 0,
  InvalidRequest,
  ServerError,
  InvalidCredentials,
}

export type forgotPasswordResetRequest = {
  userId: ObjectIdString;
  email: string;
  newPassword: string;
};

export type forgotPasswordResetResponse = {
  error: forgotPasswordResetError;
};

export function forgotPasswordReset(
  app: Express,
  client: MongoClient
): RequestHandler {
  /* Programmatically ensure the request body is of type `forgotPasswordResetRequest`. */
  function isForgotPasswordResetRequest(
    obj: any
  ): obj is forgotPasswordResetRequest {
    return (
      obj != null &&
      typeof obj === "object" &&
      "userId" in obj &&
      isObjectIdString(obj.userId) &&
      "email" in obj &&
      typeof obj.email === "string" &&
      "newPassword" in obj &&
      typeof obj.newPassword === "string"
    );
  }

  return async (req: Request, res: Response) => {
    let response: forgotPasswordResetResponse = { error: 0 };

    try {
      if (!isForgotPasswordResetRequest(req.body)) {
        response.error = forgotPasswordResetError.InvalidRequest;
        res.status(200).json(response);
        return;
      }

      const { userId, email, newPassword } = req.body;
      /*
            if(userId != null && typeof userId === 'string'){
                // Go to the data base and update
                const db = client.db()

                const result = await db.collection('Users').updateOne(
                        {'_id': new ObjectId(userId)},
                        {
                            $set: {hasVerifiedEmail: true}
                        }
                    )
            
                if(result.modifiedCount != 1){
                    response.error = forgotPasswordResetError.InvalidCredentials
                }
            } else {
                response.error = forgotPasswordResetError.InvalidRequest
                res.status(200).json(response)
                return
            }
            */

      // Go to the data base and update
      const db = client.db();

      const result = await db.collection("Users").updateOne(
        { _id: new ObjectId(userId), email: email },
        {
          $set: { password: newPassword },
        }
      );

      if (result.modifiedCount != 1) {
        response.error = forgotPasswordResetError.InvalidCredentials;
      }
    } catch (e) {
      response.error = forgotPasswordResetError.ServerError;
      console.log(e);
    }

    res.status(200).json(response);
  };
}
