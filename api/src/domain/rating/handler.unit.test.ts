import {
  validLogger,
  validPrismaClientKnownError,
  validResponse
} from '@shared/testing/generate-valid-inputs'
import { IRatingService } from '@domain/rating/service'
import { assertType } from '@shared/assert-type'
import { ratingHandlerFactory } from '@domain/rating/handler'
import { Request } from 'express'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

describe('Rating Handler Unit Test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addRating Handler', () => {
    it('should return 200 OK with a Rating on valid rating', async () => {
      // Arrange
      const body = {
        productId: 1,
        value: 5
      }
      const auth = { id: 1 }
      const rating = {
        ...body,
        userId: auth.id
      }
      const req: Request = assertType({ auth, body })
      const ratingService: IRatingService = assertType({
        addRating: jest.fn().mockResolvedValue(rating)
      })
      const ratingHandler = ratingHandlerFactory(validLogger, ratingService)

      // Act
      await ratingHandler.addRating(req, validResponse, () => {})

      // Assert
      expect(ratingService.addRating).toHaveBeenCalledWith(rating)
      expect(validResponse.send).toHaveBeenCalledWith({
        message: 'Rating creation successful',
        data: rating
      })
    })

    it('should throw an AppError on invalid Rating', async () => {
      // Arrange
      const body = {
        productId: -1,
        value: -5
      }
      const auth = { id: 1 }
      const req: Request = assertType({ auth, body })
      const ratingService: IRatingService = assertType({
        addRating: jest.fn()
      })
      const ratingHandler = ratingHandlerFactory(validLogger, ratingService)
      let expectedError: AppError

      // Act
      try {
        await ratingHandler.addRating(req, validResponse, () => {})
      } catch (err) {
        expectedError = assertType(err)
      }

      // Assert
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY
      )
      expect(ratingService.addRating).not.toHaveBeenCalled()
      expect(validResponse.send).not.toHaveBeenCalled()
    })

    it('should throw an AppError on unique conflict', async () => {
      // Arrange
      const body = {
        productId: 1,
        value: 5
      }
      const auth = { id: 1 }
      const req: Request = assertType({ auth, body })
      const ratingService: IRatingService = assertType({
        addRating: jest.fn().mockRejectedValue(validPrismaClientKnownError)
      })
      const ratingHandler = ratingHandlerFactory(validLogger, ratingService)
      let expectedError: AppError

      // Act
      try {
        await ratingHandler.addRating(req, validResponse, () => {})
      } catch (err) {
        expectedError = assertType(err)
      }

      // Assert
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(HTTPStatusCodes.CONFLICT)
      expect(ratingService.addRating).toHaveBeenCalled()
      expect(validResponse.send).not.toHaveBeenCalled()
    })
  })

  describe('updateRating Handler', () => {
    it('should return 200 OK with a rating on valid rating', async () => {
      // Arrange
      const body = {
        productId: 1,
        value: 5
      }
      const auth = { id: 1 }
      const rating = {
        ...body,
        userId: auth.id
      }
      const req: Request = assertType({ auth, body })
      const ratingService: IRatingService = assertType({
        updateRating: jest.fn().mockResolvedValue(rating)
      })
      const ratingHandler = ratingHandlerFactory(validLogger, ratingService)

      // Act
      await ratingHandler.updateRating(req, validResponse, () => {})

      // Assert
      expect(ratingService.updateRating).toHaveBeenCalledWith(rating)
      expect(validResponse.send).toHaveBeenCalledWith({
        message: 'Rating update successful',
        data: rating
      })
    })

    it('should throw an AppError on invalid rating', async () => {
      // Arrange
      const body = {
        productId: -1,
        value: -5
      }
      const auth = { id: 1 }
      const req: Request = assertType({ auth, body })
      const ratingService: IRatingService = assertType({
        updateRating: jest.fn()
      })
      const ratingHandler = ratingHandlerFactory(validLogger, ratingService)
      let expectedError: AppError

      // Act
      try {
        await ratingHandler.updateRating(req, validResponse, () => {})
      } catch (err) {
        expectedError = assertType(err)
      }

      // Assert
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY
      )
      expect(ratingService.updateRating).not.toHaveBeenCalled()
      expect(validResponse.send).not.toHaveBeenCalled()
    })

    it('should throw an AppError on non-existent rating', async () => {
      // Arrange
      const body = {
        productId: 3,
        value: 5
      }
      const auth = { id: 1 }
      const req: Request = assertType({ auth, body })
      const ratingService: IRatingService = assertType({
        updateRating: jest.fn().mockRejectedValue(validPrismaClientKnownError)
      })
      const ratingHandler = ratingHandlerFactory(validLogger, ratingService)
      let expectedError: AppError

      // Act
      try {
        await ratingHandler.updateRating(req, validResponse, () => {})
      } catch (err) {
        expectedError = assertType(err)
      }

      // Assert
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(HTTPStatusCodes.CONFLICT)
      expect(ratingService.updateRating).toHaveBeenCalled()
      expect(validResponse.send).not.toHaveBeenCalled()
    })
  })
})
