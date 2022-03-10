
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production'
            PORT?: string
            MONGODB_URI: string
            USDA_API_KEY: string
        }
    }
}

export {}
