import { Express, Request, RequestHandler, Response } from 'express'
import { MongoClient, ObjectId } from 'mongodb'
import { brotliDecompressSync } from 'zlib'
import { extractRecipe, isObjectIdString, isPortion, isRecipe, isRecipeFood, isNutrient, Nutrient, ObjectIdString, Portion, Recipe, RecipeFood } from '../global-types'
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
    userId: ObjectIdString
    ingredients: RecipeFood[]
    description: string
    jwtToken: any
}

export type RecipesPostResponse = {
    recipeId: ObjectIdString | null
    error: RecipesPostError
    jwtToken: any
}

function getTotalNutrientsRecipe(ingredients: RecipeFood[]): Nutrient[] {
    // @ts-ignore

    const keepOnlyNutrients = [
        1106, 1109, 1114, 1124, 1162, 1165, 1166, 1167, 1174, 1175, 1176, 1177, 1178,
        1180, 1183, 1184, 1185, 1187, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094,
        1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1141, 1142, 1149, 1213,
        1214, 1215, 1216, 1217, 1218, 1219, 1220, 1221, 1222, 1223, 1224, 1225, 1226,
        1227, 1232, 1233, 1234, 1003, 1004, 1005, 1009, 1010, 1011, 1012, 1013, 1050,
        1063, 1257, 1258, 1291, 1292, 1293, 2047, 2048
    ]

    let totalNutrientsDict: any = {}
    for (const recipeFood of ingredients) {
        for (const nutrient of recipeFood.food.nutrients) {
            if (nutrient.nutrientId in totalNutrientsDict) {
                totalNutrientsDict[nutrient.nutrientId].value += (recipeFood.amountUsed.quantity *  nutrient.value * recipeFood.amountUsed.portion.gramAmount) / 100 
            } else {
                const newNutrient : Nutrient = {
                    nutrientId: nutrient.nutrientId,
                    nutrientName: nutrient.nutrientName,
                    unitName: nutrient.unitName,
                    value: (recipeFood.amountUsed.quantity *  nutrient.value * recipeFood.amountUsed.portion.gramAmount) / 100
                }
                totalNutrientsDict[nutrient.nutrientId] = newNutrient
            }
        }
    }
    let totalNutrients: Nutrient[] = Object.values(totalNutrientsDict)

    return totalNutrients
}

export function recipesPost(app: Express, client: MongoClient): RequestHandler {

    function isRecipesPostRequest(obj: any): obj is RecipesPostRequest {
        return obj != null && typeof obj === 'object'
            && 'userId' in obj && isObjectIdString(obj.userId)
            && 'ingredients' in obj && Array.isArray(obj.ingredients) && obj.ingredients.every(isRecipeFood)
            && 'description' in obj && typeof obj.description === 'string'
            && 'jwtToken' in obj && obj.jwtToken != null
    }

    return async (req: Request, res: Response) => {

        let response: RecipesPostResponse = { recipeId: null, error: 0, jwtToken: null }

        try {
            if (!isRecipesPostRequest(req.body)) {
                response.error = RecipesPostError.InvalidRequest
                res.status(200).json(response)
                return
            }

            const { userId, ingredients, description, jwtToken } = req.body

            const recipe: Recipe = {
                userId,
                ingredients,
                fdcId: 0,
                description,
                nutrients: getTotalNutrientsRecipe(ingredients),
                portions: [{
                    portionId: 0,
                    portionName: "1 serving",
                    gramAmount: 100
                }],
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
    userId: ObjectIdString
    recipeId: ObjectIdString
    jwtToken: any
} | {
    userId: ObjectIdString
    description: string
    jwtToken: any
} | {
    userId: ObjectIdString
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

            const userId = req.query.userId ?? req.body.userId
            const recipeId = req.query.recipeId ?? req.body.recipeId
            const description = req.query.description?? req.body.description
            const jwtToken = req.query.jwtToken ?? req.body.jwtToken
            
            if ( token.isExpired(jwtToken)) {
                response.jwtToken = null
                response.error = RecipesGetError.jwtError
                res.status(200).json(response)
                return
            } else { 
                response.jwtToken = jwtToken;
            }


            const db = client.db()

            if (recipeId != null) {

                // Search by id.
                console.log('Search by id.')

                if (!isObjectIdString(recipeId) || !isObjectIdString(userId)) {
                    response.error = RecipesGetError.InvalidRequest
                    response.jwtToken = null
                    response.recipes = []
                    res.status(200).json(response)
                    return
                }

                const queryResults = await db.collection('Recipes').find({
                    '_id': new ObjectId(recipeId),
                    userId
                }).toArray()

                // Trusty that the database is formatted correctly.
                response.recipes = (queryResults as unknown as Recipe[]).map(extractRecipe)

                res.status(200).json(response)
                return
            } else if (description != null) {
                
                // Search by name.
                console.log('Search by name.')

                if (typeof description !== 'string' || !isObjectIdString(userId)) {
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
                        $match: {
                            'userId': userId
                        }
                    },
                    {
                        $limit: 10
                    }
                ]).toArray()

                // Trusty that the database output is formatted correctly.
                response.recipes = (queryResults as unknown as Recipe[]).map(extractRecipe)

            } else {
                
                // Search for ALL.
                console.log('Search for all.')

                if (!isObjectIdString(userId)) {
                    response.error = RecipesGetError.InvalidRequest
                    response.jwtToken = null;
                    response.recipes = []
                    res.status(200).json(response)
                    return
                }

                const queryResults = await db.collection('Recipes').find({
                    userId
                }).toArray()

                // Trusty that the database is formatted correctly.
                response.recipes = (queryResults as unknown as Recipe[]).map(extractRecipe)

                res.status(200).json(response)
                return
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
            const jwtToken = req.body.jwtToken

            const update: Recipe = {
                recipeId: req.body.recipe.recipeId,
                userId: req.body.recipe.userId,
                ingredients: req.body.recipe.ingredients,
                fdcId: 0,
                description: req.body.recipe.description,
                nutrients: getTotalNutrientsRecipe(req.body.recipe.ingredients),
                portions: [{
                    portionId: 0,
                    portionName: "1 serving",
                    gramAmount: 100
                }],
            }

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
