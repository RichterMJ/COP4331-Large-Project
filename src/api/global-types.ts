
/*
 * This file contains types that may be used across multiple API endpoints.
 * 
 * Prolly should've done this in an object-oriented style since it's getting pretty girthy ._.
 * In fact, we may have been able to use a library such as mongoose. Oh well.
 */


////////////////////////////////////////
// type ObjectIdString
//
// String for the MongoDB IDs.
////////////////////////////////////////

export type ObjectIdString = string

// Format is 24 hex chars.
export function isObjectIdString(objectId: any): objectId is ObjectIdString {
    const objectIdFmt = /^[0-9a-fA-F]{24}$/
    return typeof objectId === 'string' && objectIdFmt.test(objectId)
}


////////////////////////////////////////
// type IsoDate
//
// String for MongoDB timestamps.
////////////////////////////////////////

export type IsoDate = string

// Format is more or less:
// xxxx-xx-xx
export function isIsoDate(date: any): date is string {
    const dateFmt = /^\d{4}-\d{2}-\d{2}$/
    return typeof date === 'string' && dateFmt.test(date)
}


////////////////////////////////////////
// type IsoTimestamp
//
// String for MongoDB timestamps.
////////////////////////////////////////

export type IsoTimestamp = string

// Format is more or less:
// xxxx-xx-xxTxx:xx:xx.xxZ
// Where milliseconds are optional.
export function isIsoTimestamp(timestamp: any): timestamp is IsoTimestamp {
    const isoFmt = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d*)?Z$/
    return typeof timestamp === 'string' && isoFmt.test(timestamp)
}


////////////////////////////////////////
// type AnyDate
////////////////////////////////////////

export type AnyDate = Date | IsoTimestamp | IsoDate

export function isDate(obj: any): obj is Date {
    return obj != null && obj instanceof Date
}

export function isAnyDate(obj: any): obj is AnyDate {
    return isDate(obj)
        || isIsoDate(obj)
        || isIsoTimestamp(obj)
}

////////////////////////////////////////
// type Unit
////////////////////////////////////////

export type UnitObject = {
    type: string
    name: string
    grams: number
}

//// Can be just ID or an actual object. Use the functions to differentiate.
//export type Unit = ObjectIdString | UnitObject
//
//export function isUnitId(unit: any): unit is ObjectIdString {
//    return isObjectIdString(unit)
//}

export type Unit = UnitObject

export function isUnitObject(obj: any): obj is UnitObject {
    return obj != null && typeof obj === 'object'
        && 'type' in obj && typeof obj.type === 'string'
        && 'name' in obj && typeof obj.name === 'string'
        && 'grams' in obj && typeof obj.grams === 'number'
}

export function isUnit(unit: any): unit is Unit {
    return isUnitObject(unit)
}


////////////////////////////////////////
// type FoodRecord
////////////////////////////////////////

export type FoodRecord = {
    foodRecordId?: ObjectIdString
    creationTimestamp: AnyDate
    eatenTimestamp: AnyDate
    eatenAmount: number
    eatenUnit: Unit
    foodId: number
}

/* Programmatically ensure `obj` is of type `FoodRecordPostRequest`. */
export function isFoodRecord(obj: any): obj is FoodRecord {
    return obj != null && typeof obj === 'object'
        && (!('foodRecordId' in obj) || isObjectIdString(obj.foodRecordId))
        && 'creationTimestamp' in obj && isAnyDate(obj.creationTimestamp)
        && 'eatenTimestamp' in obj && isAnyDate(obj.eatenTimestamp)
        && 'eatenAmount' in obj && typeof obj.eatenAmount === 'number'
        && 'eatenUnit' in obj && isUnit(obj.eatenUnit)
        && 'foodId' in obj && typeof obj.foodId === 'number'
}


////////////////////////////////////////
// type User
//
// Mainly for the database.
//
// TODO Maybe make this a MongoDB schema instead?
////////////////////////////////////////

export type User = {
    userId?: ObjectIdString
    firstname: string
    lastname: string
    username: string
    email: string
    password: string
    hasConfirmedEmail: boolean
}

export function isUser(obj: any): obj is User {
    return obj != null && typeof obj === 'object'
        && (!('userId' in obj) || isObjectIdString(obj.userId))
        && 'firstname' in obj && typeof obj.firstname === 'string'
        && 'lastname' in obj && typeof obj.lastname === 'string'
        && 'username' in obj && typeof obj.username === 'string'
        && 'email' in obj && typeof obj.email === 'string'
        && 'password' in obj && typeof obj.password === 'string'
        && 'hasConfirmedEmail' in obj && typeof obj.hasConfirmedEmail === 'boolean'
}


////////////////////////////////////////
// type Recipe
////////////////////////////////////////

type RecipeFood = {
    foodId: string
    foodName: string
    amount: number
    unit: Unit
}

export type Recipe = {
    recipeId?: ObjectIdString
    recipeName: string
    userId: ObjectIdString
    foods: RecipeFood[]
}

export function isRecipe(obj: any): obj is Recipe {

    function isRecipeFood(obj: any): boolean {
        return obj != null && typeof obj === 'object'
            && 'foodId' in obj && typeof obj.foodId === 'string'
            && 'foodName' in obj && typeof obj.foodName === 'string'
            && 'amount' in obj && typeof obj.foodId === 'number'
            && 'unit' in obj && isUnit(obj.unit)
    }

    return obj != null && typeof obj === 'object'
        && (!('recipeId' in obj) || isObjectIdString(obj.recipeId))
        && 'recipeName' in obj && typeof obj.recipeName === 'string'
        && 'userId' in obj && isObjectIdString(obj.userId)
        && 'foods' in obj && Array.isArray(obj.foods) && obj.foods.every(isRecipeFood)
}

/* Basically returns `obj` ignoring any extra fields in `obj`. Since I'm OCD like that. */
export function extractRecipe(obj: Recipe & { _id?: ObjectIdString }): Recipe {

    function extractRecipeFoods(obj: RecipeFood): RecipeFood {
        const recipeFood: RecipeFood = {
            foodId: obj.foodId,
            foodName: obj.foodName,
            amount: obj.amount,
            unit: obj.unit,
        }

        return recipeFood
    }

    const recipe = {
        recipeId: obj.recipeId ?? obj._id,
        recipeName: obj.recipeName,
        userId: obj.userId,
        foods: obj.foods.map(extractRecipeFoods),
    }

    return recipe
}
