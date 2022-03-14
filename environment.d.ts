
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            /* Deployment or production mode. */
            NODE_ENV: 'development' | 'production'

            /* What port to run the frontend. */
            PORT?: string

            /* Connection URI for mongodb. */
            MONGODB_URI: string

            /* API key for the USDA's FoodData Central API. */
            USDA_API_KEY: string
        }
    }
}

export {}
