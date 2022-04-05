import { Express, Request, RequestHandler, Response } from 'express'
import { MongoClient, ObjectId } from 'mongodb'
import { brotliDecompressSync } from 'zlib'
import { extractRecipe, isObjectIdString, isPortion, isRecipe, isRecipeFood, ObjectIdString, Portion, Recipe, RecipeFood } from '../global-types'
import { FoodRecordDeleteError, FoodRecordPutError } from '../users/data/foodRecords';
var token = require('../createJWT');

////////////////////////////////////////
// POST
////////////////////////////////////////

export enum RecipesPostError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    jwtError
}

export type RecipesPostRequest = {
    userId?: ObjectIdString
    ingredients: RecipeFood[]
    description: string
    portions: Portion[]
    jwtToken: any
}

export type RecipesPostResponse = {
    recipeId: ObjectIdString | null
    error: RecipesPostError
    jwtToken: any
}

export function recipesPost(app: Express, client: MongoClient): RequestHandler {

    function isRecipesPostRequest(obj: any): obj is RecipesPostRequest {
        return obj != null && typeof obj === 'object'
            && 'ingredients' in obj && Array.isArray(obj.ingredients) && obj.ingredients.every(isRecipeFood)
            && 'description' in obj && typeof obj.description === 'string'
            && 'portions' in obj && Array.isArray(obj.portions) && obj.portions.every(isPortion)
            && 'jwtToken' in obj && obj.jwtToken != null
    }

    return async (req: Request, res: Response) => {

        let response: RecipesPostResponse = { recipeId: null, error: 0, jwtToken: null }

        const paramUserId = req.params.userId ?? req.body.userId

        try {
            if (!isRecipesPostRequest(req.body) || !isObjectIdString(paramUserId)) {
                response.error = RecipesPostError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { jwtToken } = req.body

            const recipe: Recipe = {
                userId: paramUserId,
                ingredients: req.body.ingredients,

                fdcId: 0,
                description: req.body.description,
                nutrients: [], // TODO Calculate total nutrients.
                portions: req.body.portions,
            }


            if( token.isExpired(jwtToken))
            {
                response.jwtToken = null;

                response.error = RecipesPostError.jwtError
                res.status(200).json(response);
                return;
            } else { 
                response.jwtToken = jwtToken;
            }

            const db = client.db()
            const queryResult = await db.collection('Recipes').insertOne(recipe)

            if (queryResult.acknowledged && queryResult.insertedId != null) {
                response.recipeId = queryResult.insertedId.toString()
            } else {
                response.error = RecipesPostError.ServerError
                response.jwtToken = null
                response.recipeId = null
                res.status(200).json(response)
                return
            }

        } catch (e) {
            console.log(e)
            response.error = RecipesPostError.ServerError
            response.jwtToken = null
            response.recipeId = null
            res.status(200).json(response)
            return
        }

        try
        {
          const jwtRefresh = token.refresh(response.jwtToken);
          response.jwtToken = jwtRefresh.accessToken
    
          if(jwtRefresh.error){
            response.jwtToken = null
            response.recipeId = null
            response.error = RecipesPostError.jwtError
          }
    
        }
        catch(e)
        {
          response.jwtToken = null
          response.recipeId = null
          response.error = RecipesPostError.jwtError
        }

        res.status(200).json(response)
        return
    }
}


////////////////////////////////////////
// GET
////////////////////////////////////////

export enum RecipesGetError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    jwtError
}

export type RecipesGetRequest = {
    recipeId: ObjectIdString,
    jwtToken: any
} | {
    description: string,
    jwtToken: any
}

export type RecipesGetResponse = {
    recipes: Recipe[]
    error: RecipesGetError
    jwtToken: any
}

// Accepts request in body or URI as a query parameter.
// Precedence is undefined when it comes to:
// - Searches by URI vs body.
// - Searches by ID vs recipeName.
// Reason: The devs should always choose one or the other!
export function recipesGet(app: Express, client: MongoClient): RequestHandler {

    return async (req: Request, res: Response) => {

        let response: RecipesGetResponse = { recipes: [], error: 0, jwtToken: null }

        try {

            const recipeId = req.query.recipeId ?? req.body.recipeId
            const description = req.query.description?? req.body.description
            const jwtToken = req.query.jwtToken ?? req.body.jwtToken
            
            if( token.isExpired(jwtToken))
            {
                response.jwtToken = null;
                response.error = RecipesGetError.jwtError
                res.status(200).json(response);
                return;
            } else { 
                response.jwtToken = jwtToken;
            }


            const db = client.db()

            if (recipeId != null) {

                // Search by id.

                if (!isObjectIdString(recipeId)) {
                    response.error = RecipesGetError.InvalidRequest
                    response.jwtToken = null;
                    response.recipes = []
                    res.status(200).json(response)
                    return
                }

                const queryResults = await db.collection('Recipes').find({
                    '_id': new ObjectId(recipeId)
                }).toArray()

                // Trusty that the database is formatted correctly.
                response.recipes = (queryResults as unknown as Recipe[]).map(extractRecipe)

                res.status(200).json(response)
                return
            } else {
                
                // Search by name.

                if (typeof description !== 'string') {
                    response.error = RecipesGetError.InvalidRequest
                    response.jwtToken = null;
                    response.recipes = []
                    res.status(200).json(response)
                    return
                }

                const queryResults = await db.collection('Recipes').aggregate([
                    {
                        $search: {
                            text: {
                                query: description,
                                path: 'description',
                                fuzzy: {},
                            }
                        }
                    },
                    {
                        $limit: 10
                    }
                ]).toArray()

                // Trusty that the database output is formatted correctly.
                response.recipes = (queryResults as unknown as Recipe[]).map(extractRecipe)

            }
        } catch (e) {
            console.log(e)
            response.error = RecipesGetError.ServerError
            response.jwtToken = null;
            response.recipes = []
            res.status(200).json(response)
            return
        }

        try
        {
            const jwtRefresh = token.refresh(response.jwtToken);
            response.jwtToken = jwtRefresh.accessToken

            if(jwtRefresh.error){
                response.jwtToken = null
                response.recipes = []
                response.error = RecipesGetError.jwtError
            }

        }
        catch(e)
        {
            response.jwtToken = null
            response.recipes = []
            response.error = RecipesGetError.jwtError
        }

        res.status(200).json(response)
        return
    }
}

////////////////////////////////////////
// PUT
////////////////////////////////////////

export enum RecipesPutError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    InvalidId,
    jwtError
}

export type RecipesPutRequest = {
    recipe: Recipe
    jwtToken: any
}
export type RecipesPutResponse = {
    error: RecipesPutError
    jwtToken: any
}

export function recipesPut(app: Express, client: MongoClient): RequestHandler {
    function isRecipesPutRequest(obj: any): obj is RecipesPutRequest {
        return obj != null && typeof obj === 'object'
            && 'recipe' in obj && isRecipe(obj.recipe)
            && 'jwtToken' in obj && obj.jwtToken != null
    }

    return async (req: Request, res: Response) => {

        let response: RecipesPutResponse = { error: 0, jwtToken: null }

        try {

            if (!isRecipesPutRequest(req.body)) {
                response.error = RecipesPutError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const recipeId = req.body.recipe.recipeId
            const update: Recipe = extractRecipe(req.body.recipe)
            const jwtToken = req.body.jwtToken

            if( token.isExpired(jwtToken))
            {
                response.jwtToken = null;
                response.error = RecipesPutError.jwtError
                res.status(200).json(response);
                return;
            } else { 
                response.jwtToken = jwtToken;
            }

            const db = client.db()
            const queryResult = await db.collection('Recipes').replaceOne(
                { "_id": new ObjectId(recipeId) },
                update
            )

            // If the query was acknowledged and there were no modifications, then the id was bad.
            if (queryResult.modifiedCount === 0 && queryResult.acknowledged) {
                response.jwtToken = null;
                response.error = RecipesPutError.InvalidId
                res.status(200).json(response);
                return;
            }

        } catch (e) {
            console.log(e)
            response.error = RecipesPutError.ServerError
            response.jwtToken = null;
            res.status(200).json(response)
            return
        }

        try
        {
          const jwtRefresh = token.refresh(response.jwtToken);
          response.jwtToken = jwtRefresh.accessToken
    
          if(jwtRefresh.error){
            response.jwtToken = null
            response.error = RecipesPutError.jwtError
          }
    
        }
        catch(e)
        {
          response.jwtToken = null
          response.error = RecipesPutError.jwtError
        }

        res.status(200).json(response)
        return
    }
}

////////////////////////////////////////
// DELETE
////////////////////////////////////////

export enum RecipesDeleteError {
    Ok = 0,
    InvalidRequest,
    ServerError,
    InvalidId,
    jwtError
}

export type RecipesDeleteRequest = {
    recipeId: ObjectIdString
    jwtToken: any
}

export type FoodRecordDeleteResponse = {
    error: RecipesDeleteError
    jwtToken: any
}

export function recipesDelete(app: Express, client: MongoClient): RequestHandler {

    function isFoodRecordDeleteRequest(obj: any): obj is RecipesDeleteRequest {
        return obj != null && typeof obj === 'object'
            && 'recipeId' in obj && isObjectIdString(obj.recipeId)
            && 'jwtToken' in obj && obj.jwtToken != null 
    }

    return async (req: Request, res: Response) => {
        let response: FoodRecordDeleteResponse = { error: 0, jwtToken: null }

        try {
            
            if (!isFoodRecordDeleteRequest(req.body)) {
                response.error = RecipesDeleteError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const recipeId = req.body.recipeId
            const jwtToken = req.body.jwtToken

            if( token.isExpired(jwtToken))
            {
                response.jwtToken = null;
                response.error = RecipesDeleteError.jwtError
                res.status(200).json(response);
                return;
            } else { 
                response.jwtToken = jwtToken;
            }

            const db = client.db()
            const queryResult = await db
                .collection('Recipes')
                .deleteOne({ "_id": new ObjectId(recipeId) })

            // If the query was acknowledged and there were no modifications, then the id was bad.
            if (queryResult.deletedCount === 0 && queryResult.acknowledged) {
                response.error = RecipesDeleteError.InvalidId
                response.jwtToken = null;
                res.status(200).json(response);
                return;
            }

        } catch (e) {
            console.log(e)
            response.jwtToken = null;
            response.error = RecipesDeleteError.ServerError
            res.status(200).json(response)
            return
        }

        try
        {
          const jwtRefresh = token.refresh(response.jwtToken);
          response.jwtToken = jwtRefresh.accessToken
    
          if(jwtRefresh.error){
            response.jwtToken = null
            response.error = RecipesDeleteError.jwtError
          }
    
        }
        catch(e)
        {
          response.jwtToken = null
          response.error = RecipesDeleteError.jwtError
        }

        res.status(200).json(response)
        return
    }
}
