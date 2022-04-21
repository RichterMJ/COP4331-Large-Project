import { Express } from 'express'
import { MongoClient } from 'mongodb'
import { searchFoodByName } from './api/food/searchFoodByName'
import { searchFoodById } from './api/food/searchFoodById'
import { foodRecordsDelete, foodRecordsGet, foodRecordsPost, foodRecordsPut } from './api/users/data/foodRecords'
import { login } from './api/users/login'
import { register } from './api/users/register'
import { recipesDelete, recipesGet, recipesPost, recipesPut } from './api/food/recipes'
import { sendVerificationEmail } from './api/users/emailVerification/sendVerificationEmail'
import { verifyEmail } from './api/users/emailVerification/verifyEmail'
import { forgotPasswordEmail } from './api/users/forgotPassword/forgotPasswordEmail'
import { forgotPasswordReset } from './api/users/forgotPassword/forgotPasswordReset'
import { foodAverage, FoodAverageError } from './api/food/foodAverage'
import { edit, editPassword } from './api/users/edit'
import { rdi } from './api/food/rdi'

/* Set up the routing. Logic should go under './api/'. */
export function setApp (app: Express, client: MongoClient) {

    app.post('/api/users/login', login(app, client))
    app.post('/api/users/register', register(app, client))
    app.post('/api/users/edit', edit(app, client))
    app.post('/api/users/editPassword', editPassword(app, client))

    app.post('/api/users/emailVerification/sendVerificationEmail', sendVerificationEmail(app, client))
    app.post('/api/users/emailVerification/verifyEmail', verifyEmail(app, client))

    app.post('/api/users/forgotPassword/forgotPasswordEmail', forgotPasswordEmail(app, client))
    app.post('/api/users/forgotPassword/forgotPasswordReset', forgotPasswordReset(app, client))

    app.post('/api/food/searchByName', searchFoodByName(app, client))
    app.post('/api/food/searchById', searchFoodById(app, client))
    app.post('/api/food/foodAverage', foodAverage(app, client))
    app.get('/api/food/rdi', rdi(app, client))

    app.post('/api/users/data/foodRecords', foodRecordsPost(app, client))
    app.get('/api/users/data/foodRecords', foodRecordsGet(app, client))
    app.put('/api/users/data/foodRecords', foodRecordsPut(app, client))
    app.delete('/api/users/data/foodRecords', foodRecordsDelete(app, client))

    app.post('/api/users/data/recipes', recipesPost(app, client))
    app.get('/api/users/data/recipes', recipesGet(app, client))
    app.put('/api/users/data/recipes', recipesPut(app, client))
    app.delete('/api/users/data/recipes', recipesDelete(app, client))
}
