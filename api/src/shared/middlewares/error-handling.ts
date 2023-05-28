import { IMiddleware } from '@/types'
import { ErrorRequestHandler } from 'express'
import { Logger } from 'pino'
import { AppError } from '@shared/app-error'
import { HttpStatus } from '@shared/http-status'

export class ErrorHandlingMiddleware implements IMiddleware {
  constructor(private readonly logger: Logger) {}
  handler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (!(error instanceof AppError)) {
      error = new AppError(HttpStatus.INTERNAL_ERROR, 'Internal Server Error')
    }

    this.logger.error(error.toString())

    return res.status(error.statusCode).send({
      error: error.toString()
    })
  }
}
