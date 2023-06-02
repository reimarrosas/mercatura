import { ICommentService } from '@domain/comment/service'
import { validComment } from '@domain/comment/utils/valid-test-input'
import { assertType } from '@shared/assert-type'
import {
  validLogger,
  validPrismaClientKnownError,
  validResponse
} from '@shared/testing/generate-valid-inputs'
import { Request } from 'express'
import { commentHandlerFactory } from '@domain/comment/handler'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

describe('Comment Handler Unit Test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createComment Handler', () => {
    it('should return 200 OK on valid comment', async () => {
      // Arrange
      const auth = { id: 1 }
      const body = { productId: 1, content: 'Sample Comment, Hello, World!' }
      const req: Request = assertType({ auth, body })
      const commentService: ICommentService = assertType({
        createComment: jest.fn().mockResolvedValue(validComment)
      })
      const commentHandler = commentHandlerFactory(validLogger, commentService)

      // Act
      await commentHandler.createComment(req, validResponse, () => {})

      // Arrange
      expect(commentService.createComment).toHaveBeenCalledWith({
        userId: auth.id,
        ...body
      })
      expect(validResponse.send).toHaveBeenCalledWith({
        message: 'Comment creation successful',
        data: validComment
      })
    })

    it('should throw an AppError on invalid comment schema', async () => {
      // Arrange
      const auth = { id: undefined }
      const body = { productId: -1, content: '' }
      const req: Request = assertType({ auth, body })
      const commentService: ICommentService = assertType({
        createComment: jest.fn()
      })
      const commentHandler = commentHandlerFactory(validLogger, commentService)
      let expectedError: AppError

      // Act
      try {
        await commentHandler.createComment(req, validResponse, () => {})
      } catch (err) {
        expectedError = assertType(err)
      }

      // Arrange
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY
      )
      expect(commentService.createComment).not.toHaveBeenCalled()
      expect(validResponse.send).not.toHaveBeenCalled()
    })

    it('should throw an AppError on database conflicts', async () => {
      const auth = { id: 1 }
      const body = { productId: 1, content: 'Sample Comment, Hello, World!' }
      const req: Request = assertType({ auth, body })
      const commentService: ICommentService = assertType({
        createComment: jest.fn().mockRejectedValue(validPrismaClientKnownError)
      })
      const commentHandler = commentHandlerFactory(validLogger, commentService)
      let expectedError: AppError

      // Act
      try {
        await commentHandler.createComment(req, validResponse, () => {})
      } catch (err) {
        expectedError = assertType(err)
      }

      // Arrange
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(HTTPStatusCodes.CONFLICT)
      expect(commentService.createComment).toHaveBeenCalledWith({
        userId: auth.id,
        ...body
      })
      expect(validResponse.send).not.toHaveBeenCalled()
    })
  })
})
