// Dotenv
import { config } from 'dotenv'
if (process.env['NODE_ENV'] !== 'production') {
    config({
        path: process.env['NODE_ENV'] === 'test' ? '.env.test.local' : undefined
    })
}

// Session
import RedisStore from 'connect-redis'
import session from 'express-session'
import { createClient } from 'redis'

export const redisClient = createClient({ url: process.env['REDIS_URL'] })
redisClient.connect().catch(console.error)

const redisStore = new RedisStore({ client: redisClient, prefix: 'mercatura:' })

export const sessionMiddleware = session({
    store: redisStore,
    secret: process.env['SESSION_SECRET'] ?? 'keyboard cat',
    resave: false,
    saveUninitialized: false
})