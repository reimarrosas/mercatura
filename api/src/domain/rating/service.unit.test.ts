import {
  Context,
  createMockContext,
  MockContext
} from '@shared/testing/mock-ctx'
import { assertType } from '@shared/assert-type'
import { IRatingService, ratingServiceFactory } from '@domain/rating/service'
import { validPrismaClientKnownError } from '@shared/testing/generate-valid-inputs'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/data-proxy'

describe('Rating Service Unit Test', () => {
  let mockCtx: MockContext
  let ratingService: IRatingService

  beforeEach(() => {
    mockCtx = createMockContext()
    const ctx: Context = assertType(mockCtx)
    ratingService = ratingServiceFactory(ctx.prisma)
  })

  describe('addRating', () => {
    it('should return the rating on successful add', async () => {
      // Arrange
      const rating = {
        userId: 1,
        productId: 1,
        value: 5
      }
      mockCtx.prisma.rating.create.mockResolvedValue(rating)

      // Act
      const result = await ratingService.addRating(rating)

      // Assert
      expect(mockCtx.prisma.rating.create).toHaveBeenCalledWith({
        data: rating
      })
      expect(result).toEqual(rating)
    })

    it('should throw a PrismaClientKnownRequestError on existing rating', async () => {
      // Arrange
      const rating = {
        userId: 1,
        productId: 1,
        value: 5
      }
      mockCtx.prisma.rating.create.mockRejectedValue(
        validPrismaClientKnownError
      )
      let expectedError: any

      // Act
      try {
        await ratingService.addRating(rating)
      } catch (err) {
        expectedError = err
      }

      // Assert
      expect(mockCtx.prisma.rating.create).toHaveBeenCalledWith({
        data: rating
      })
      expect(expectedError).toBeInstanceOf(PrismaClientKnownRequestError)
    })
  })

  describe('updateRating', () => {
    it('should return the new rating on successful update', async () => {
      // Arrange
      const rating = {
        userId: 1,
        productId: 1,
        value: 4
      }
      mockCtx.prisma.rating.update.mockResolvedValue(rating)

      // Act
      const result = await ratingService.updateRating(rating)

      // Assert
      expect(mockCtx.prisma.rating.update).toHaveBeenCalledWith({
        data: { value: rating.value },
        where: {
          productId_userId: {
            userId: rating.userId,
            productId: rating.productId
          }
        }
      })
      expect(result).toEqual(rating)
    })

    it('should throw a PrismaClientKnowRequestError on non-existent rating', async () => {
      // Arrange
      const rating = {
        userId: 1,
        productId: 3,
        value: 5
      }
      mockCtx.prisma.rating.update.mockRejectedValue(
        validPrismaClientKnownError
      )
      let expectedError: any

      // Act
      try {
        await ratingService.updateRating(rating)
      } catch (err) {
        expectedError = err
      }

      // Assert
      expect(mockCtx.prisma.rating.update).toHaveBeenCalledWith({
        data: { value: rating.value },
        where: {
          productId_userId: {
            userId: rating.userId,
            productId: rating.productId
          }
        }
      })
      expect(expectedError).toBeInstanceOf(PrismaClientKnownRequestError)
    })
  })
})
