
//const HOST = 'http://localhost:8080'
//const API = `/api/users/data/recipes`
//
////    recipeId?: ObjectIdString
////    error: RecipesPostError
////    jwtToken: any
//
//test(`POST on `, () => {
//    const recipePost = {
//        "userId": "622910c478b931f01ede2c7e",
//        "recipeName": "Orange Tacos",
//        "ingredients": [
//            {
//                "foodId": "123456789012345678901234",
//                "foodName": "beef taco",
//                "amount": 2,
//                "unit": { "type": "taco", "name": "taco", "grams": 100}
//            },
//            {
//                "foodId": "qwertyuiopqwertyuiopqwer",
//                "foodName": "orange",
//                "amount": 6,
//                "unit": { "type": "slice", "name": "slice", "grams": 15 }
//            }
//        ]
//    }
//
//    expect(
//        await fetch(URL, {
//            method: 'POST',
//            body: JSON.stringify(recipePost)
//        })
//    ).toBeCalledWith({
//        expect.objectContaining({
//            recipeId: expect.toMatch(/[0-9a-fA-F]{24}/),
//            error: 1,
//            jwToken: expect.any()
//        })
//    })
//})

