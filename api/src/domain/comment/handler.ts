import { ILogger } from '@config/logger'
import { ICommentService } from '@domain/comment/service'
import { RequestHandler } from 'express'
import { comment } from '@domain/comment/dto'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

export const commentHandlerFactory = (
  logger: ILogger,
  commentService: ICommentService
) => {
  const createComment: RequestHandler = async (req, res) => {
    const result = comment.safeParse({
      userId: req.auth?.id,
      productId: req.body['productId'],
      content: req.body['content']
    })

    if (!result.success) {
      throw new AppError(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY,
        'Invalid request body schema'
      )
    }

    try {
      const data = await commentService.createComment(result.data)

      return res.send({
        message: 'Comment creation successful',
        data
      })
    } catch (err) {
      logger.error(err)
      throw new AppError(
        HTTPStatusCodes.CONFLICT,
        'Cannot create comment due to conflict'
      )
    }
  }

  return {
    createComment
  }
}
