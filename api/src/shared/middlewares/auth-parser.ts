import { NextFunction, Request, Response } from 'express'
import { IJwtHelper } from '@type/auth'
import { IMiddleware } from '@/types'

export class AuthParserMiddleware implements IMiddleware {
  constructor(private readonly jwtHelper: IJwtHelper) {}

  private extractBearerToken = (authHeader?: string) => {
    if (!authHeader) {
      return undefined
    }

    const [, token] = authHeader.split(' ')

    return token
  }

  handler = (req: Request, _res: Response, next: NextFunction) => {
    const bearerToken = this.extractBearerToken(req.headers['authorization'])

    if (bearerToken) {
      req.auth = this.jwtHelper.extractPayload(bearerToken)
    }

    return next()
  }
}
