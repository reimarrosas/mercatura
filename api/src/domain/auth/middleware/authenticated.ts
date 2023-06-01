import { RequestHandler } from 'express'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

export const authenticated: RequestHandler = (req, _res, next) => {
  if (!req.auth) {
    throw new AppError(HTTPStatusCodes.UNAUTHORIZED, 'User unauthenticated')
  }

  next()
}
