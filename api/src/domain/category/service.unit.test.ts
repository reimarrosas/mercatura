import { Context, createMockContext, MockContext } from '@shared/testing/db-ctx'
import { assertType } from '@shared/assert-type'
import { validCategoryList } from '@domain/category/utils/valid-test-inputs'
import {
  categoryServiceFactory,
  ICategoryService
} from '@domain/category/service'
import { validProductList } from '@domain/product/utils/valid-test-input'
import { Category } from '@prisma/client'

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

  describe('getCategoryProducts', () => {
    it('should return a list of products on valid category id', async () => {
      // Arrange
      const testId = 1
      const products = validProductList.filter(
        prod => prod.categoryId === testId
      )
      const category1Products: Category = assertType({ products })
      mockCtx.prisma.category.findUnique.mockResolvedValue(category1Products)

      // Act
      const result = await categoryService.getCategoryProducts(testId)

      // Assert
      expect(mockCtx.prisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: testId },
        include: { products: true }
      })
      expect(result).toEqual(products)
    })

    it('should return an empty list on non-existing category', async () => {
      // Arrange
      const testId = 100
      const category100Products: Category = assertType({ products: [] })
      mockCtx.prisma.category.findUnique.mockResolvedValue(category100Products)

      // Act
      const result = await categoryService.getCategoryProducts(testId)

      // Assert
      expect(mockCtx.prisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: testId },
        include: { products: true }
      })
      expect(result.length).toBe(0)
    })
  })
})
