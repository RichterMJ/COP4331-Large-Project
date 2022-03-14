
// Types that may be used across multiple API endpoints.


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

export type PortionObject = {
    id: number
    PortionName: string
    gramWeight: number
}

//// Can be just ID or an actual object. Use the functions to differentiate.
//export type Unit = ObjectIdString | UnitObject
//
//export function isUnitId(unit: any): unit is ObjectIdString {
//    return isObjectIdString(unit)
//}

export type Portion = PortionObject

export function isPortionObject(Portion: any): Portion is PortionObject {
  return Portion != null && typeof Portion === 'object'
        && 'id' in Portion && typeof Portion.id === 'number'
        && 'PortionName' in Portion && typeof Portion.PortionName === 'string'
        && 'gramWeight' in Portion && typeof Portion.gramWeight === 'number'
}

export function isPortion(Portion: any): Portion is Portion {
  return isPortionObject(Portion)
}

export type Nutrient = {
    nutrientId: number
    nutrientName: string
    nutrientNumber : number
    unitName: string
    value: number
    foodNutrientId: number
}

export function isNutrient(obj: any): obj is Nutrient {
  return obj != null && typeof obj === 'object'
        && 'nutrientId' in obj && typeof obj.nutrientId === 'number'
        && 'nutrientName' in obj && typeof obj.nutrientName === 'string'
        && 'nutrientNumber' in obj && typeof obj.nutrientNumber === 'number'
        && 'unitName' in obj && typeof obj.unitName === 'string'
        && 'value' in obj && typeof obj.value === 'number'
        && 'foodNutrientId' in obj && typeof obj.foodNutrientId === 'number'
}

export type ConsumedAmount = {
    portionId: number,
    quantity: number
}

export function isConsumedAmount(obj: any): obj is ConsumedAmount {
  return obj != null && typeof obj === 'object'
          && 'portionId' in obj && typeof obj.portionId === 'number'
          && 'quantity' in obj && typeof obj.quantity === 'number'
}

////////////////////////////////////////
// type Food
////////////////////////////////////////

export type Food = {
    fdcId : number
    description: string
    foodNutrients: Nutrient[]
    foodPortions: Portion[] | null
}

/* Programmatically ensure `obj` is of type `FoodRecordPostRequest`. */
export function isFood(obj: any): obj is Food {
  return obj != null && typeof obj === 'object'
        && (!('fdcId' in obj) || typeof obj.fdcId === 'number')
        && 'description' in obj && typeof obj.description === 'string'
        && 'foodNutrients' in obj && obj.foodNutrients.every(isNutrient)
        && 'foodPortions' in obj && obj.foodPortions.every(isPortion)
        && 'foodConsumed' in obj && isConsumedAmount(obj.foodConsumed)
        && 'creationTimestamp' in obj && isAnyDate(obj.creationTimestamp)
        && 'eatenTimestamp' in obj && isAnyDate(obj.eatenTimestamp)
}



////////////////////////////////////////
// type FoodRecord
////////////////////////////////////////

export type FoodRecord = {
    item: Food
    foodConsumed: ConsumedAmount
    creationTimestamp: AnyDate
    eatenTimestamp: AnyDate
    totalNutrients: Nutrient[]
    userId: number
}

/* Programmatically ensure `obj` is of type `FoodRecordPostRequest`. */
export function isFoodRecord(obj: any): obj is FoodRecord {
  return obj != null && typeof obj === 'object'
        && (!('item' in obj) || isFood(obj.item))
        && 'foodConsumed' in obj && isConsumedAmount(obj.foodConsumed)
        && 'creationTimestamp' in obj && isAnyDate(obj.creationTimestamp)
        && 'eatenTimestamp' in obj && isAnyDate(obj.eatenTimestamp)
        && 'totalNutrients' in obj && totalNutrients.every(isNutrient) //maybe chnage
        && 'userId' in obj && typeof obj.userId === 'number'
}

