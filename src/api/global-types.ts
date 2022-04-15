
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
// type User
////////////////////////////////////////

export type User = {
    firstname: string
    lastname: string
    email: string
    password: string
    hasVerifiedEmail: boolean
    weight: number
}

export function isUser(obj: any): obj is User {
    return obj != null && typeof obj === 'object'
        && 'firstname' in obj && typeof obj.firstname === 'string'
        && 'lastname' in obj && typeof obj.lastname === 'string'
        && 'email' in obj && typeof obj.email === 'string'
        && 'password' in obj && typeof obj.password === 'string'
        && 'hasVerifiedEmail' in obj && typeof obj.hasVerifiedEmail === 'boolean'
        && 'weight' in obj && typeof obj.weight === 'number'
}


////////////////////////////////////////
// type Portion
////////////////////////////////////////

export type Portion = {
    portionId: number
    portionName?: string
    gramAmount: number
}

export function isPortion(obj: any): obj is Portion {
    return obj != null && typeof obj === 'object'
        && 'portionId' in obj && typeof obj.portionId === 'number'
        && (!('portionName' in obj) || typeof obj.portionName === 'string')
        && 'gramAmount' in obj && typeof obj.gramAmount === 'number'
}

export type Nutrient = {
    nutrientId: number
    nutrientName: string
    unitName: string
    value: number
}

export function isNutrient(obj: any): obj is Nutrient {
    return obj != null && typeof obj === 'object'
        && 'nutrientId' in obj && typeof obj.nutrientId === 'number'
        && 'nutrientName' in obj && typeof obj.nutrientName === 'string'
        && 'unitName' in obj && typeof obj.unitName === 'string'
        && 'value' in obj && typeof obj.value === 'number'
}

export type AmountConsumed = {
    portion: Portion
    quantity: number
}

export function isAmountConsumed(obj: any): obj is AmountConsumed {
    return obj != null && typeof obj === 'object'
        && 'portion' in obj && isPortion(obj.portion)
        && 'quantity' in obj && typeof obj.quantity === 'number'
}

////////////////////////////////////////
// type Food
////////////////////////////////////////

export type Food = {
    fdcId: number
    description: string
    nutrients: Nutrient[]
    portions: Portion[]
}

/* Programmatically ensure `obj` is of type `FoodRecordPostRequest`. */
export function isFood(obj: any): obj is Food {
    return obj != null && typeof obj === 'object'
        && 'fdcId' in obj && typeof obj.fdcId === 'number'
        && 'description' in obj && typeof obj.description === 'string'
        && 'nutrients' in obj && Array.isArray(obj.nutrients) && obj.nutrients.every(isNutrient)
        && 'portions' in obj && Array.isArray(obj.portions) && obj.portions.every(isPortion)
}



////////////////////////////////////////
// type FoodRecord
////////////////////////////////////////

export type FoodRecord = {
    foodRecordId?: ObjectIdString
    userId: ObjectIdString
    food: Food
    amountConsumed: AmountConsumed
    creationTimestamp: AnyDate
    eatenTimestamp: AnyDate
    totalNutrients: Nutrient[]
}

/* Programmatically ensure `obj` is of type `FoodRecordPostRequest`. */
export function isFoodRecord(obj: any): obj is FoodRecord {
    return obj != null && typeof obj === 'object'
        && (!('foodRecordId' in obj) || isObjectIdString(obj.foodRecordId))
        && 'userId' in obj && isObjectIdString(obj.userId)
        && 'food' in obj && isFood(obj.food)
        && 'amountConsumed' in obj && isAmountConsumed(obj.amountConsumed)
        && 'creationTimestamp' in obj && isAnyDate(obj.creationTimestamp)
        && 'eatenTimestamp' in obj && isAnyDate(obj.eatenTimestamp)
        && 'totalNutrients' in obj && Array.isArray(obj.totalNutrients) && obj.totalNutrients.every(isNutrient)
}


////////////////////////////////////////
// type Recipe (extends Food)
////////////////////////////////////////

export type RecipeFood = {
    food: Food
    amountUsed: AmountConsumed
}

export function isRecipeFood(obj: any): boolean {
    return obj != null && typeof obj === 'object'
        && 'food' in obj && isFood(obj.food)
        && 'amountUsed' in obj && isAmountConsumed(obj.amountUsed)
}


export type Recipe = Food & {
    recipeId?: ObjectIdString
    userId: ObjectIdString
    ingredients: RecipeFood[]
}

export function isRecipe(obj: any): obj is Recipe {
    return obj != null && typeof obj === 'object'
        && (!('recipeId' in obj) || isObjectIdString(obj.recipeId))
        && 'userId' in obj && isObjectIdString(obj.userId)
        && 'ingredients' in obj && Array.isArray(obj.ingredients) && obj.ingredients.every(isRecipeFood)
        && isFood(obj)
}

/* Basically returns `obj` ignoring any extra fields in `obj`. Tbh this is just me being OCD. Might delete idk. */
export function extractRecipe(obj: Recipe & { _id?: ObjectIdString }): Recipe {

    function extractRecipeFoods(obj: RecipeFood): RecipeFood {
        const recipeFood: RecipeFood = {
            food: obj.food,
            amountUsed: obj.amountUsed,
        }

        return recipeFood
    }

    const recipe = {
        recipeId: obj.recipeId ?? obj._id?.toString() ?? obj._id, // Database results will always have `._id` instead of `recipeId`.
        userId: obj.userId,
        ingredients: obj.ingredients.map(extractRecipeFoods),
    
        fdcId: obj.fdcId,
        description: obj.description,
        nutrients: obj.nutrients,
        portions: obj.portions,
    }

    return recipe
}
