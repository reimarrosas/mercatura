import { ILogger } from '@config/logger'
import { ICommentService } from '@domain/comment/service'
import { RequestHandler } from 'express'
import { comment, deleteComment as deleteParser } from '@domain/comment/dto'
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

  const updateComment: RequestHandler = async (req, _res) => {
    const result = comment.safeParse({
      id: req.params['id'],
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
      const data = await commentService.updateComment(result.data)

      return _res.send({
        message: 'Comment update successful',
        data
      })
    } catch (err) {
      throw new AppError(
        HTTPStatusCodes.CONFLICT,
        'Cannot update comment due to conflict'
      )
    }
  }

  const deleteComment: RequestHandler = async (req, res) => {
    const result = deleteParser.safeParse({
      userId: req.auth?.id,
      id: req.params['id']
    })

    if (!result.success) {
      throw new AppError(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY,
        'Invalid request schema'
      )
    }

    const data = await commentService.deleteComment(result.data)

    if (!data) {
      throw new AppError(
        HTTPStatusCodes.NOT_FOUND,
        `Comment ${result.data.id} not found`
      )
    }

    return res.send({
      message: 'Comment deletion successful',
      data
    })
  }

  return {
    createComment,
    updateComment,
    deleteComment
  }
}
