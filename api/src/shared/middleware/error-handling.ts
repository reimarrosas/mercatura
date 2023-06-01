import { ErrorRequestHandler } from 'express'
import { AppError, HTTPStatusCodes } from '@shared/app-error'
import logger from '@config/logger'

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error(err)

  if (!(err instanceof AppError)) {
    err = new AppError(
      HTTPStatusCodes.INTERNAL_SERVER_ERROR,
      'Internal Server Error'
    )
  }

  return res.status(err.statusCode).send({
    error: err.toString()
  })
}
