import fetch from 'node-fetch'

const HOST = 'http://localhost:8080'
const ENDPOINT = `/api/users/data/recipes`
const URL = `${HOST}${ENDPOINT}`


////////////////////////////////////////
// POST
////////////////////////////////////////

const postCases = [
    ['chicken'],
    ['chickne'],
    ['hcicken'],
    ['ChIcKeN'],
]

describe(`POST on ${ENDPOINT}`, async () => {
    test.each(postCases)(
        'Testing %s',
        async (query) => {
            expect(await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    query,
                    pageSize: 10,
                    start: 0,
                    jwtToken: {},
                })
            })).toBeCalledWith({
                currentPage: 0,
                foods: expect.arrayContaining(expect.objectContaining({
                    fdcId: expect.any(Number),
                    description: expect.any(String),
                    nutrients: expect.any(Array),
                    portions: expect.any(Array),
                })),
                error: 0,
                jwtToken: expect.anything()
            })
        }
    )
})

