import { RequestHandler, Request, Response, Express, query } from 'express'
import { MongoClient, WriteError } from 'mongodb'
const token = require("./createJWT.js");

export enum LoginError {
    Ok = 0,
    InvalidCredentials,
    ServerError
}

export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = {
    userId: ObjectIdString
    firstname: string
    lastname: string
    error: LoginError
    accessToken: any;
}

/* Returns a function of type `RequestHandler` to be used in a route. */
export function login(app: Express, client: MongoClient): RequestHandler {
    return async (req: Request, res: Response) => {

        /*
            /*axios(config).then(function (result) {
                var resp = result.data;
                if (resp.error) 
                {
                    response.error = resp.error;
                }
                else 
                {	
                    storage.storeToken(res);
                    var jwt = require('jsonwebtoken');
        
                    var ud = jwt.decode(storage.retrieveToken(),{complete:true});
                    
                    var userId = ud.payload.userId;
                    var firstName = ud.payload.firstName;
                    var lastName = ud.payload.lastName;
                      
                    var user = {firstName:firstName,lastName:lastName,id:userId}
                    localStorage.setItem('user_data', JSON.stringify(user));
                    window.location.href = '/cards';
                }
            }).catch(); */

        */
        let response: LoginResponse = { userId: '', firstname: '', lastname: '', error: LoginErr.ServerError, accessToken: null }

        try {
            const { email, password } = req.body as LoginRequest
            const db = client.db()
            const queryResults = await db
                .collection('Users')
                .find({ email, password })
                .toArray()

            if (queryResults.length > 0) {
                response.userId = queryResults[0]._id.toString()
                response.firstname = queryResults[0].firstname
                response.lastname = queryResults[0].lastname
                response.error = LoginError.Ok
                
                response.accessToken = token.createToken( response.firstname, response.lastname, response.userId );
            } else {
                response.error = LoginError.InvalidCredentials
            }
        } catch (e) {
            response = {
                userId: '',
                firstname: '',
                lastname: '',
                error: LoginError.ServerError,
                accessToken: null
            }
        }

        res.status(200).json(response)
    }
}
