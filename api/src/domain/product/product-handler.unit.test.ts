import { IProductService } from '@domain/product/product.service'
import { validProductList } from '@domain/product/utils/valid-test-input'
import { productHandlerFactory } from '@domain/product/product.handler'
import {
  validLogger,
  validResponse
} from '@shared/testing/generate-valid-inputs'
import { Request } from 'express'
import { AppError, HTTPStatusCodes } from '@shared/app-error'
import { assertType } from '@shared/assert-type'

describe('Product Handler Unit Test', () => {
  let productService: IProductService

  beforeEach(() => {
    productService = assertType({})
    jest.clearAllMocks()
  })

  describe('getAllProducts Handler', () => {
    it('should return 200 OK with a list of products', async () => {
      // Arrange
      productService.getAllProducts = jest
        .fn()
        .mockResolvedValue(validProductList)
      const productHandler = productHandlerFactory(validLogger, productService)

      // Act
      await productHandler.getAllProducts(
        {} as Request,
        validResponse,
        () => {}
      )

      // Assert
      expect(validResponse.send).toHaveBeenCalledWith({
        message: 'Fetching all products successful',
        data: validProductList
      })
    })
  })

  describe('getProduct Handler', () => {
    it('should return 200 OK with a product on valid ID', async () => {
      // Arrange
      const req: Request = assertType({ params: { id: '1' } })
      productService.getProduct = jest
        .fn()
        .mockResolvedValue(validProductList[0]!)
      const productHandler = productHandlerFactory(validLogger, productService)

      // Act
      await productHandler.getProduct(req, validResponse, () => {})

      // Assert
      expect(productService.getProduct).toHaveBeenCalledWith(1)
      expect(validResponse.send).toHaveBeenCalledWith({
        message: 'Fetching Product 1 successful',
        data: validProductList[0]!
      })
    })

    it.each([
      ['non-existing product', '100', HTTPStatusCodes.NOT_FOUND],
      ['invalid id value', '-100', HTTPStatusCodes.UNPROCESSABLE_ENTITY]
    ])('should throw an AppError on %s', async (_desc, id, statusCode) => {
      // Arrange
      const req: Request = assertType({ params: { id } })
      productService.getProduct = jest.fn().mockResolvedValue(undefined)
      const productHandler = productHandlerFactory(validLogger, productService)
      let expectedError: AppError

      // Act
      try {
        await productHandler.getProduct(req, validResponse, () => {})
      } catch (err) {
        expectedError = err as AppError
      }

      // Assert
      expect(validResponse.send).not.toHaveBeenCalled()
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(statusCode)
    })
  })

  describe('searchProducts Handler', () => {
    const matchProducts = (term: string) =>
      validProductList.filter(
        product =>
          product.description.toLowerCase().includes(term) &&
          product.name.toLowerCase().includes(term)
      )

    it('should return 200 OK and all matching products', async () => {
      // Arrange
      const term = 'sample'
      const req: Request = assertType({ query: { term } })
      const matchingProducts = matchProducts(term)
      productService.searchProducts = jest
        .fn()
        .mockResolvedValue(matchingProducts)
      const productHandler = productHandlerFactory(validLogger, productService)

      // Act
      await productHandler.searchProducts(req, validResponse, () => {})

      // Assert
      expect(validResponse.send).toHaveBeenCalledWith({
        message: `Fetching Products related to '${term}' successful`,
        data: matchingProducts
      })
      expect(productService.searchProducts).toHaveBeenCalledWith(term)
    })

    it('should throw an AppError on invalid search term', async () => {
      // Arrange
      const term = ['sample', 'test']
      const req: Request = assertType({ query: { term } })
      productService.searchProducts = jest.fn()
      const productHandler = productHandlerFactory(validLogger, productService)
      let expectedError: AppError

      // Act
      try {
        await productHandler.searchProducts(req, validResponse, () => {})
      } catch (err) {
        expectedError = assertType(err)
      }

      // Assert
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY
      )
      expect(productService.searchProducts).not.toHaveBeenCalled()
      expect(validResponse.send).not.toHaveBeenCalled()
    })
  })
})
