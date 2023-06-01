import { RequestHandler } from 'express'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

export const notFoundMiddleware: RequestHandler = (req, _res, next) =>
  next(new AppError(HTTPStatusCodes.NOT_FOUND, `${req.originalUrl} not found`))
