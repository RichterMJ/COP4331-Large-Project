import { Express } from 'express'
import { MongoClient } from 'mongodb'
import { searchFoodByName } from './api/food/searchFoodByName'
import { searchFoodById } from './api/food/searchFoodById'
import { foodRecordsDelete, foodRecordsGet, foodRecordsPost, foodRecordsPut } from './api/users/data/foodRecords'
import { login } from './api/users/login'
import { register } from './api/users/register'

/* Set up the routing. Logic should go under './api/'. */
export function setApp (app: Express, client: MongoClient) {

    app.post('/api/users/login', login(app, client))
    app.post('/api/users/register', register(app, client))

    app.post('/api/food/searchByName', searchFoodByName(app, client))
    app.post('/api/food/searchById', searchFoodById(app, client))

    app.post('/api/users/data/foodRecords', foodRecordsPost(app, client))
    app.get('/api/users/data/foodRecords', foodRecordsGet(app, client))
    app.put('/api/users/data/foodRecords', foodRecordsPut(app, client))
    app.delete('/api/users/data/foodRecords', foodRecordsDelete(app, client))
}
