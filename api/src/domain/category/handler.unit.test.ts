import { ICategoryService } from '@domain/category/service'
import { assertType } from '@shared/assert-type'
import {
  validLogger,
  validResponse
} from '@shared/testing/generate-valid-inputs'
import { Request } from 'express'
import { validCategoryList } from '@domain/category/utils/valid-test-inputs'
import { categoryHandlerFactory } from '@domain/category/handler'

describe('Category Handler Unit Test', () => {
  describe('getAllCategories Handler', () => {
    it('should return 200 OK with a list of categories', async () => {
      // Arrange
      const categoryService: ICategoryService = assertType({
        getAllCategories: jest.fn().mockResolvedValue(validCategoryList)
      })
      const categoryHandler = categoryHandlerFactory(
        validLogger,
        categoryService
      )

      // Act
      await categoryHandler.getAllProducts(
        {} as Request,
        validResponse,
        () => {}
      )

      // Assert
      expect(categoryService.getAllCategories).toHaveBeenCalled()
      expect(validResponse.send).toHaveBeenCalledWith({
        message: 'Fetching Categories successful',
        data: validCategoryList
      })
    })
  })
})
