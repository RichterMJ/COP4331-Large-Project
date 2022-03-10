
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

export function isUnitObject(unit: any): unit is UnitObject {
    return unit != null && typeof unit === 'object'
        && 'type' in unit && typeof unit.type === 'string'
        && 'name' in unit && typeof unit.name === 'string'
        && 'grams' in unit && typeof unit.grams === 'number'
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
        && (!('foodRecordId' in obj) || typeof obj.foodRecordId === 'string')
        && 'creationTimestamp' in obj && isAnyDate(obj.creationTimestamp)
        && 'eatenTimestamp' in obj && isAnyDate(obj.eatenTimestamp)
        && 'eatenAmount' in obj && typeof obj.eatenAmount === 'number'
        && 'eatenUnit' in obj && isUnit(obj.eatenUnit)
        && 'foodId' in obj && typeof obj.foodId === 'number'
}
