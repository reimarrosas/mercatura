import { ICategoryService } from '@domain/category/service'
import { assertType } from '@shared/assert-type'
import {
  validLogger,
  validResponse
} from '@shared/testing/generate-valid-inputs'
import { Request } from 'express'
import { validCategoryList } from '@domain/category/utils/valid-test-inputs'
import { categoryHandlerFactory } from '@domain/category/handler'
import { validProductList } from '@domain/product/utils/valid-test-input'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

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

  describe('getCategoryProducts Handler', () => {
    it('should return 200 OK with list of category products on valid id', async () => {
      // Arrange
      const testId = 1
      const req: Request = assertType({ params: { id: testId } })
      const products = validProductList.filter(
        prod => prod.categoryId === testId
      )
      const categoryService: ICategoryService = assertType({
        getCategoryProducts: jest.fn().mockResolvedValue(products)
      })
      const categoryHandler = categoryHandlerFactory(
        validLogger,
        categoryService
      )

      // Act
      await categoryHandler.getCategoryProducts(req, validResponse, () => {})

      // Assert
      expect(categoryService.getCategoryProducts).toHaveBeenCalledWith(testId)
      expect(validResponse.send).toHaveBeenCalledWith({
        message: `Fetching Category ${testId} related Products successful`,
        data: products
      })
    })

    it('should throw an AppError on invalid id parameter', async () => {
      // Arrange
      const testId = 'WRONG_ID'
      const req: Request = assertType({ params: { id: testId } })
      const categoryService: ICategoryService = assertType({
        getCategoryProducts: jest.fn()
      })
      const categoryHandler = categoryHandlerFactory(
        validLogger,
        categoryService
      )
      let expectedError: AppError

      // Act
      try {
        await categoryHandler.getCategoryProducts(req, validResponse, () => {})
      } catch (err) {
        expectedError = assertType(err)
      }

      // Assert
      expect(categoryService.getCategoryProducts).not.toHaveBeenCalled()
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY
      )
    })
  })
})
