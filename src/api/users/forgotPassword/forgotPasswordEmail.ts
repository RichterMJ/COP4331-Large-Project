import { RequestHandler, Request, Response, Express, query } from 'express'
import { MongoClient, ObjectId, Timestamp } from 'mongodb'
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import {
    ObjectIdString, isObjectIdString,
    IsoDate, isIsoDate,
    IsoTimestamp, isIsoTimestamp,
    FoodRecord, isFoodRecord,
    Nutrient, isNutrient,
    Portion, isPortion,
    AmountConsumed, isAmountConsumed, Food, isFood,
} from '../../global-types'
import {URL} from '../../../index'


export enum forgotPasswordEmailError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    InvalidCredentials,
}

export type forgotPasswordEmailRequest = {
    email: string
}

export type forgotPasswordEmailResponse = {
    error: forgotPasswordEmailError
}


export function forgotPasswordEmail(app: Express, client: MongoClient): RequestHandler {

    /* Programmatically ensure the request body is of type `forgotPasswordEmailRequest`. */
    function isForgotPasswordEmailRequest(obj: any): obj is forgotPasswordEmailRequest {
        return obj != null && typeof obj === 'object'
            && 'email' in obj && typeof obj.email === 'string'
    }

    return async (req: Request, res: Response) => {
        let response: forgotPasswordEmailResponse = { error: 0 }

        try {
            if (!isForgotPasswordEmailRequest(req.body)) {
                response.error = forgotPasswordEmailError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { email } = req.body

            //Get userId from emailAddress

            let userId;
            
            if(email != null && typeof email === 'string'){
                // Go to the data base and update
                const db = client.db()

                const result = await db.collection('Users').findOne(
                        { 'email': email}
                    )
            
                if(result == null){
                    response.error = forgotPasswordEmailError.InvalidCredentials
                } else {
                    userId = result._id
                }
            } else {
                response.error = forgotPasswordEmailError.InvalidRequest
                res.status(200).json(response)
                return
            }

            // Send email
            var transporter = nodemailer.createTransport(smtpTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: { 
                    user: process.env.EMAIL_ADDRESS,
                    pass: process.env.PASSWORD
                }
            }));

            var mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: email,
                subject: 'Change your password',
                text: `Go to the following link to change your password: ${URL}/api/users/forgotPassword/forgotPasswordReset?userId=${userId}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if(error){
                    response.error = forgotPasswordEmailError.ServerError
                    console.log(error)
                } else {
                    console.log(info)
                }
            })


        } catch (e) {
            response.error = forgotPasswordEmailError.ServerError
            console.log(e)
        }

        res.status(200).json(response)
    }
}
