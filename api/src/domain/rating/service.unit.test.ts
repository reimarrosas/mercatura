import { Context, createMockContext, MockContext } from '@shared/testing/db-ctx'
import { assertType } from '@shared/assert-type'
import { IRatingService, ratingServiceFactory } from '@domain/rating/service'

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
  })
})
