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


export enum sendVerificationEmailError {
    Ok = 0,
    InvalidRequest,
    ServerError,
}

export type sendVerificationEmailRequest = {
    userId: ObjectIdString
    email: string
}

export type sendVerificationEmailResponse = {
    error: sendVerificationEmailError
}


export function sendVerificationEmail(app: Express, client: MongoClient): RequestHandler {

    /* Programmatically ensure the request body is of type `sendVerificationEmailRequest`. */
    function isSendVerificationEmailRequest(obj: any): obj is sendVerificationEmailRequest {
        return obj != null && typeof obj === 'object'
            && 'userId' in obj && isObjectIdString(obj.userId)
            && 'email' in obj && typeof obj.email === 'string'
    }

    return async (req: Request, res: Response) => {
        let response: sendVerificationEmailResponse = { error: 0 }

        try {
            if (!isSendVerificationEmailRequest(req.body)) {
                response.error = sendVerificationEmailError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { userId, email } = req.body

            // Send email
            var transporter = nodemailer.createTransport(smtpTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: { 
                    user: process.env.EMAIL_ADDRESS,
                    pass: process.env.PASSWORD
                }
            }));

            const emailUrl = `http://${process.env.URL}/#/emailVerify?userId=${userId}`
            const logoRef = 'design_assets/Logo/thirdLogo.png'
            const html = `<p>Click <a href=${emailUrl}>here</a> to verify your account. </p> <p>From GitFit</p> <img src="cid:img"/>`
            
            var mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: email,
                subject: 'Verify Your Account',
                html: html,
                attachments: [{
                    filename: 'logo.png',
                    path: logoRef, 
                    cid: 'img' 
                   }]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if(error){
                    response.error = sendVerificationEmailError.ServerError
                    console.log(error)
                } else {
                    console.log(info)
                }
            })


        } catch (e) {
            response.error = sendVerificationEmailError.ServerError
            console.log(e)
        }

        res.status(200).json(response)
    }
}