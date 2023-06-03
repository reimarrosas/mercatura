import { Context, createMockContext, MockContext } from '@shared/testing/db-ctx'
import {
  validProductList,
  validSingleProduct
} from '@domain/product/utils/valid-test-input'
import { IProductService, productServiceFactory } from '@domain/product/service'
import { assertType } from '@shared/assert-type'

describe('Product Service Unit Test', () => {
  let mockCtx: MockContext
  let productService: IProductService

  beforeEach(() => {
    mockCtx = createMockContext()
    const ctx: Context = assertType(mockCtx)
    productService = productServiceFactory(ctx.prisma)
  })

  describe('getAllProducts', () => {
    it('should return a list of products', async () => {
      // Arrange
      mockCtx.prisma.product.findMany.mockResolvedValue(validProductList)

      // Act
      const result = await productService.getAllProducts()

      // Assert
      expect(mockCtx.prisma.product.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: {
              Rating: true
            }
          }
        }
      })
      expect(result).toEqual(validProductList)
    })
  })

  describe('getProduct', () => {
    it('should return a single product on existing ID', async () => {
      // Arrange
      mockCtx.prisma.product.findUnique.mockResolvedValue(validSingleProduct)

      // Act
      const result = await productService.getProduct(1)

      // Assert
      expect(mockCtx.prisma.product.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          include: {
            _count: { select: { Rating: true } },
            Comment: true
          }
        })
      )
      expect(result).toEqual(validSingleProduct)
    })

    it('should return undefined on non-existent product', async () => {
      // Arrange
      mockCtx.prisma.product.findUnique.mockResolvedValue(null)

      // Act
      const result = await productService.getProduct(10)

      // Assert
      expect(mockCtx.prisma.product.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 10 },
          include: {
            _count: { select: { Rating: true } },
            Comment: true
          }
        })
      )
      expect(result).toBeUndefined()
    })
  })

  describe('searchProduct', () => {
    const findManyInput = (searchTerm: string) =>
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } }
          ]
        },
        include: {
          _count: {
            select: {
              Rating: true
            }
          }
        }
      })

    it('should return all products that has the search term', async () => {
      // Arrange
      const searchTerm = 'Sample'
      const matchingProducts = validProductList.filter(
        product =>
          product.description.includes(searchTerm) &&
          product.name.includes(searchTerm)
      )
      mockCtx.prisma.product.findMany.mockResolvedValue(matchingProducts)

      // Act
      const result = await productService.searchProducts(searchTerm)

      // Assert
      expect(mockCtx.prisma.product.findMany).toHaveBeenCalledWith(
        findManyInput(searchTerm)
      )
      expect(result).toEqual(matchingProducts)
    })

    it('should return an empty array on non-matching search term', async () => {
      // Arrange
      const searchTerm = 'NON_MATCHING_SEARCH_TERM'
      mockCtx.prisma.product.findMany.mockResolvedValue([])

      // Act
      const result = await productService.searchProducts(searchTerm)

      // Arrange
      expect(mockCtx.prisma.product.findMany).toHaveBeenCalledWith(
        findManyInput(searchTerm)
      )
      expect(result.length).toBe(0)
    })
  })
})
