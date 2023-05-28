import { IMiddleware } from '@/types'
import { RequestHandler } from 'express'
import { AppError } from '@shared/app-error'
import { HttpStatus } from '@shared/http-status'

export class NotFoundMiddleware implements IMiddleware {
  handler: RequestHandler = (req, _res, next) => {
    next(new AppError(HttpStatus.NOT_FOUND, `${req.originalUrl} not found`))
  }
}
