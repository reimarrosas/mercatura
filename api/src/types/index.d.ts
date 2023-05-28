import { AuthData } from './auth'
import { ErrorRequestHandler, RequestHandler } from 'express'

declare global {
  namespace Express {
    export interface Request {
      auth?: AuthData
    }
  }
}

export interface IMiddleware {
  handler: RequestHandler | ErrorRequestHandler
}
