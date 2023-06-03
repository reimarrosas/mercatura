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

  describe('updateComment Handler', () => {
    it('should return 200 OK with Comment on valid update', async () => {
      // Arrange
      const auth = { id: 1 }
      const params = { id: '1' }
      const body = { productId: 1, content: 'Sample Comment, Hello, World!' }
      const req: Request = assertType({ auth, params, body })
      const commentService: ICommentService = assertType({
        updateComment: jest.fn().mockResolvedValue(validComment)
      })
      const commentHandler = commentHandlerFactory(validLogger, commentService)

      // Act
      await commentHandler.updateComment(req, validResponse, () => {})

      // Arrange
      expect(commentService.updateComment).toHaveBeenCalledWith({
        userId: auth.id,
        id: parseInt(params.id),
        ...body
      })
      expect(validResponse.send).toHaveBeenCalledWith({
        message: 'Comment update successful',
        data: validComment
      })
    })

    it('should throw an AppError on invalid comment schema', async () => {
      // Arrange
      const auth = { id: undefined }
      const params = { id: 'hello' }
      const body = { productId: -1, content: '' }
      const req: Request = assertType({ auth, params, body })
      const commentService: ICommentService = assertType({
        updateComment: jest.fn()
      })
      const commentHandler = commentHandlerFactory(validLogger, commentService)
      let expectedError: AppError

      // Act
      try {
        await commentHandler.updateComment(req, validResponse, () => {})
      } catch (err) {
        expectedError = assertType(err)
      }

      // Arrange
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY
      )
      expect(commentService.updateComment).not.toHaveBeenCalled()
      expect(validResponse.send).not.toHaveBeenCalled()
    })

    it('should throw an AppError on database conflict', async () => {
      // Arrange
      const auth = { id: 1 }
      const params = { id: '1' }
      const body = { productId: 1, content: 'Sample Comment, Hello, World!' }
      const req: Request = assertType({ auth, params, body })
      const commentService: ICommentService = assertType({
        updateComment: jest.fn().mockRejectedValue(validPrismaClientKnownError)
      })
      const commentHandler = commentHandlerFactory(validLogger, commentService)
      let expectedError: AppError

      // Act
      try {
        await commentHandler.updateComment(req, validResponse, () => {})
      } catch (err) {
        expectedError = assertType(err)
      }

      // Arrange
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(HTTPStatusCodes.CONFLICT)
      expect(commentService.updateComment).toHaveBeenCalledWith({
        userId: auth.id,
        id: parseInt(params.id),
        ...body
      })
      expect(validResponse.send).not.toHaveBeenCalled()
    })
  })

  describe('deleteComment Handler', () => {
    it('should return 200 OK and comment on valid delete', async () => {
      // Arrange
      const auth = { id: 1 }
      const params = { id: '1' }
      const req: Request = assertType({ auth, params })
      const commentService: ICommentService = assertType({
        deleteComment: jest.fn().mockResolvedValue(validComment)
      })
      const commentHandler = commentHandlerFactory(validLogger, commentService)

      // Act
      await commentHandler.deleteComment(req, validResponse, () => {})

      // Arrange
      expect(commentService.deleteComment).toHaveBeenCalledWith({
        userId: auth.id,
        id: parseInt(params.id)
      })
      expect(validResponse.send).toHaveBeenCalledWith({
        message: 'Comment deletion successful',
        data: validComment
      })
    })

    it('should throw an AppError on invalid comment schema', async () => {
      // Arrange
      const auth = { id: -1 }
      const params = { id: 'hello' }
      const req: Request = assertType({ auth, params })
      const commentService: ICommentService = assertType({
        deleteComment: jest.fn()
      })
      const commentHandler = commentHandlerFactory(validLogger, commentService)
      let expectedError: AppError

      // Act
      try {
        await commentHandler.deleteComment(req, validResponse, () => {})
      } catch (err) {
        expectedError = assertType(err)
      }

      // Arrange
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY
      )
      expect(commentService.deleteComment).not.toHaveBeenCalled()
      expect(validResponse.send).not.toHaveBeenCalled()
    })

    it('should throw an AppError on non-existent comment', async () => {
      const auth = { id: 1 }
      const params = { id: '10' }
      const req: Request = assertType({ auth, params })
      const commentService: ICommentService = assertType({
        deleteComment: jest.fn().mockResolvedValue(undefined)
      })
      const commentHandler = commentHandlerFactory(validLogger, commentService)
      let expectedError: AppError

      // Act
      try {
        await commentHandler.deleteComment(req, validResponse, () => {})
      } catch (err) {
        expectedError = assertType(err)
      }

      // Arrange
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(HTTPStatusCodes.NOT_FOUND)
      expect(commentService.deleteComment).toHaveBeenCalledWith({
        userId: auth.id,
        id: parseInt(params.id)
      })
      expect(validResponse.send).not.toHaveBeenCalled()
    })
  })
})
