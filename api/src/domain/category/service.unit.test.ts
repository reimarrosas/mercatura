import { Context, createMockContext, MockContext } from '@shared/testing/db-ctx'
import { assertType } from '@shared/assert-type'
import { validCategoryList } from '@domain/category/utils/valid-test-inputs'
import {
  categoryServiceFactory,
  ICategoryService
} from '@domain/category/service'

describe('Category Service Unit Test', () => {
  let mockCtx: MockContext
  let categoryService: ICategoryService

  beforeEach(() => {
    mockCtx = createMockContext()
    const ctx: Context = assertType(mockCtx)
    categoryService = categoryServiceFactory(ctx.prisma)
  })

  describe('getAllCategories', () => {
    it('should return all the categories', async () => {
      // Arrange
      mockCtx.prisma.category.findMany.mockResolvedValue(validCategoryList)

      // Act
      const result = await categoryService.getAllCategories()

      // Arrange
      expect(mockCtx.prisma.category.findMany).toHaveBeenCalled()
      expect(result).toEqual(validCategoryList)
    })
  })
})
