import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AuthData } from '@type/auth'
import { IMiddleware } from '@/types'
import { IConfig } from '@type/config'

export class AuthParserMiddleware implements IMiddleware {
  constructor(private readonly config: IConfig) {}

  extractBearerToken = (authHeader?: string) => {
    if (!authHeader) {
      return undefined
    }

    const [, token] = authHeader.split(' ')

    return token
  }

  extractTokenPayload = (token: string) => {
    try {
      return jwt.verify(token, this.config.token.secret) as AuthData
    } catch (e) {
      return undefined
    }
  }

  handler = (req: Request, _res: Response, next: NextFunction) => {
    const bearerToken = this.extractBearerToken(req.headers['authorization'])

    if (bearerToken) {
      req.auth = this.extractTokenPayload(bearerToken)
    }

    return next()
  }
}
