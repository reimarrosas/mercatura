import { UserData } from './auth'

declare module 'express-session' {
    interface Session {
        user?: UserData
    }
}

export * from './auth'