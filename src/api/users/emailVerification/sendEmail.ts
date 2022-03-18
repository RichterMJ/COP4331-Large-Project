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


export enum sendEmailError {
    Ok = 0,
    InvalidRequest,
    ServerError,
}

export type sendEmailRequest = {
    userId: ObjectIdString
    emailAddress: string
}

export type sendEmailResponse = {
    error: sendEmailError
}


export function sendEmail(app: Express, client: MongoClient): RequestHandler {

    /* Programmatically ensure the request body is of type `sendEmailRequest`. */
    function isSendEmailRequest(obj: any): obj is sendEmailRequest {
        return obj != null && typeof obj === 'object'
            && 'userId' in obj && isObjectIdString(obj.userId)
            && 'emailAddress' in obj && typeof obj.emailAddress === 'string'
    }

    return async (req: Request, res: Response) => {
        let response: sendEmailResponse = { error: 0 }

        try {
            if (!isSendEmailRequest(req.body)) {
                response.error = sendEmailError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { userId, emailAddress } = req.body

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
                to: emailAddress,
                subject: 'Verify Your Account',
                text: `Go to the following link to verify your account: ${URL}/api/users/emailVerification/verifyEmail?userId=${userId}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if(error){
                    response.error = sendEmailError.ServerError
                    console.log(error)
                } else {
                    console.log(info)
                }
            })


        } catch (e) {
            response.error = sendEmailError.ServerError
            console.log(e)
        }

        res.status(200).json(response)
    }
}
