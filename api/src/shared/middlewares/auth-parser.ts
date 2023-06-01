import { RequestHandler } from 'express'
import { IConfig } from '@config/env'
import { jwtUtilsFactory } from '@shared/utils/jwt'

const extractBearerToken = (authHeader?: string) => {
  if (authHeader) {
    const [prefix, token] = authHeader.split(' ')

    if (prefix === 'Bearer') {
      return token
    }
  }

  return undefined
}

export const authParserFactory = (config: IConfig): RequestHandler => {
  return (req, _res, next) => {
    const authToken = extractBearerToken(req.headers['authorization'])

    if (authToken) {
      req.auth = jwtUtilsFactory(config).extractPayload(authToken)
    }

    return next()
  }
}
