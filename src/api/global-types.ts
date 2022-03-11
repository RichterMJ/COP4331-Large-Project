
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


////////////////////////////////////////
// type Food
////////////////////////////////////////

export type Food = {
    fdcId : number
    description: string
    foodNutrients: Nutrient[]
    foodPortions: Portion[] | null
    foodConsumed: ConsumedAmount | null
    creationTimestamp: AnyDate | null
    eatenTimestamp: AnyDate | null
    // Maybe add a section for nutrients according to the portions or make it a function
}

/* Programmatically ensure `obj` is of type `FoodRecordPostRequest`. */
export function isFood(obj: any): obj is Food {
    return obj != null && typeof obj === 'object'
        && (!('fdcId' in obj) || typeof obj.fdcId === 'number')
        && 'description' in obj && typeof obj.description === 'string'
        && 'foodNutrients' in obj && isNutrientArray(obj.foodNutrients) //make this and isNutrient method
        && 'foodPortions' in obj && isPortionArray(obj.foodPortions) // ^ 
        && 'foodConsumed' in obj && isConsumedAmount(obj.foodConsumed) // ^
        && 'creationTimestamp' in obj && isAnyDate(obj.creationTimestamp)
        && 'eatenTimestamp' in obj && isAnyDate(obj.eatenTimestamp)
}

//make functions for nutrients, portions, consumed amount and food record(and refactor attributes)
