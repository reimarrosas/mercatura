import {
  Context,
  createMockContext,
  MockContext
} from '@shared/testing/mock-ctx'
import { assertType } from '@shared/assert-type'
import { validProductList } from '@domain/product/utils/valid-test-input'
import {
  validInvoice,
  validInvoiceDto
} from '@domain/purchase/utils/valid-test-input'
import {
  IPurchaseService,
  purchaseServiceFactory
} from '@domain/purchase/service'
import {
  validConfig,
  validPrismaClientKnownError
} from '@shared/testing/generate-valid-inputs'

describe('Purchase Service Unit Test', () => {
  let mockCtx: MockContext
  let purchaseService: IPurchaseService

  beforeEach(() => {
    mockCtx = createMockContext()
    const ctx: Context = assertType(mockCtx)
    purchaseService = purchaseServiceFactory(
      ctx.prisma,
      ctx.stripe,
      validConfig
    )
  })

  describe('purchase', () => {
    it('should return the session URL on valid invoice lines', async () => {
      // Arrange
      mockCtx.prisma.product.findMany.mockResolvedValue(validProductList)
      mockCtx.prisma.$transaction.mockResolvedValue([validInvoice, {}])
      const url = 'https://sampleurl.com'
      mockCtx.stripe.checkout.sessions.create.mockResolvedValue(
        assertType({ url })
      )

      // Act
      const result = await purchaseService.purchase(validInvoiceDto)

      // Assert
      expect(mockCtx.prisma.product.findMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2, 3] } }
      })
      expect(mockCtx.prisma.product.update).toHaveBeenCalledTimes(3)
      expect(mockCtx.prisma.invoice.create).toHaveBeenCalled()
      expect(mockCtx.prisma.$transaction).toHaveBeenCalled()
      expect(mockCtx.stripe.checkout.sessions.create).toHaveBeenCalled()
      expect(result).toBe(url)
    })

    it('should return undefined on unequal number of invoice lines and products', async () => {
      // Arrange
      mockCtx.prisma.product.findMany.mockResolvedValue(validProductList)
      const invoiceDto = {
        ...validInvoiceDto,
        invoiceLines: validInvoiceDto.invoiceLines.filter(
          line => line.productId !== 3
        )
      }

      // Act
      const result = await purchaseService.purchase(invoiceDto)

      // Assert
      expect(mockCtx.prisma.product.update).not.toHaveBeenCalled()
      expect(mockCtx.prisma.invoice.create).not.toHaveBeenCalled()
      expect(mockCtx.prisma.$transaction).not.toHaveBeenCalled()
      expect(mockCtx.stripe.checkout.sessions.create).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it('should return undefined on transaction rollback', async () => {
      // Arrange
      mockCtx.prisma.product.findMany.mockResolvedValue(validProductList)
      mockCtx.prisma.$transaction.mockRejectedValue(validPrismaClientKnownError)

      // Act
      const result = await purchaseService.purchase(validInvoiceDto)

      // Assert
      expect(mockCtx.prisma.$transaction).toHaveBeenCalled()
      expect(mockCtx.stripe.checkout.sessions.create).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it('should return undefined on invalid session', async () => {
      // Arrange
      mockCtx.prisma.product.findMany.mockResolvedValue(validProductList)
      mockCtx.prisma.$transaction.mockResolvedValue([validInvoice, {}])
      mockCtx.stripe.checkout.sessions.create.mockResolvedValue(
        assertType({ url: null })
      )

      // Act
      const result = await purchaseService.purchase(validInvoiceDto)

      // Assert
      expect(result).toBeUndefined()
    })
  })
})
