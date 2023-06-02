import { ILogger } from '@config/logger'
import { IRatingService } from '@domain/rating/service'
import { RequestHandler } from 'express'
import { rating } from '@domain/rating/dto'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

export const ratingHandlerFactory = (
  logger: ILogger,
  ratingService: IRatingService
) => {
  const addRating: RequestHandler = async (req, _res) => {
    const maybeRating: unknown = {
      userId: req.auth?.id,
      productId: req.body['productId'],
      value: req.body['value']
    }

    const result = rating.safeParse(maybeRating)

    if (!result.success) {
      throw new AppError(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY,
        'Invalid request body schema'
      )
    }

    try {
      const data = await ratingService.addRating(result.data)

      return _res.send({
        message: 'Rating creation successful',
        data
      })
    } catch (err) {
      logger.error(err)
      throw new AppError(HTTPStatusCodes.CONFLICT, 'Rating already exists')
    }
  }

  const updateRating: RequestHandler = async (req, res) => {
    const maybeRating: unknown = {
      userId: req.auth?.id,
      productId: req.body['productId'],
      value: req.body['value']
    }
    const result = rating.safeParse(maybeRating)

    if (!result.success) {
      throw new AppError(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY,
        'Invalid request body schema'
      )
    }

    try {
      const data = await ratingService.updateRating(result.data)

      return res.send({
        message: 'Rating update successful',
        data
      })
    } catch (err) {
      logger.error(err)
      throw new AppError(HTTPStatusCodes.CONFLICT, 'Rating does not exist')
    }
  }

  return {
    addRating,
    updateRating
  }
}
