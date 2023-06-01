import { RequestHandler } from 'express'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

export const guest: RequestHandler = (req, _res, next) => {
  if (req.auth) {
    throw new AppError(HTTPStatusCodes.CONFLICT, 'User already authenticated')
  }

  next()
}
