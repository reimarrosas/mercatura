import { IPurchaseService } from '@domain/purchase/service'
import { assertType } from '@shared/assert-type'
import { validInvoiceDto } from '@domain/purchase/utils/valid-test-input'
import { Request } from 'express'
import {
  validLogger,
  validResponse
} from '@shared/testing/generate-valid-inputs'
import { purchaseHandlerFactory } from '@domain/purchase/handler'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

describe('Purchase Handler Unit Test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('purchase Handler', () => {
    it('should redirect to session url on valid process', async () => {
      // Arrange
      const auth = { id: 1 }
      const body = { invoiceLines: validInvoiceDto.invoiceLines }
      const req: Request = assertType({ auth, body })
      const url = 'https://sampleurl.com'
      const purchaseService: IPurchaseService = assertType({
        purchase: jest.fn().mockResolvedValue(url)
      })
      const purchaseHandler = purchaseHandlerFactory(
        validLogger,
        purchaseService
      )

      // Act
      await purchaseHandler.purchase(req, validResponse, () => {})

      // Assert
      expect(purchaseService.purchase).toHaveBeenCalledWith(validInvoiceDto)
      expect(validResponse.redirect).toHaveBeenCalledWith(303, url)
    })

    it('should throw an AppError on invalid body schema', async () => {
      const auth = { id: undefined }
      const body = { invoiceLines: [] }
      const req: Request = assertType({ auth, body })
      const purchaseService: IPurchaseService = assertType({
        purchase: jest.fn()
      })
      const purchaseHandler = purchaseHandlerFactory(
        validLogger,
        purchaseService
      )
      let expectedError: AppError

      // Act
      try {
        await purchaseHandler.purchase(req, validResponse, () => {})
      } catch (err) {
        expectedError = assertType(err)
      }

      // Assert
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY
      )
      expect(purchaseService.purchase).not.toHaveBeenCalled()
      expect(validResponse.redirect).not.toHaveBeenCalled()
    })

    it('should throw an AppError on service conflict', async () => {
      const auth = { id: 1 }
      const body = { invoiceLines: validInvoiceDto.invoiceLines }
      const req: Request = assertType({ auth, body })
      const purchaseService: IPurchaseService = assertType({
        purchase: jest.fn().mockResolvedValue(undefined)
      })
      const purchaseHandler = purchaseHandlerFactory(
        validLogger,
        purchaseService
      )
      let expectedError: AppError

      // Act
      try {
        await purchaseHandler.purchase(req, validResponse, () => {})
      } catch (err) {
        expectedError = assertType(err)
      }

      // Assert
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(HTTPStatusCodes.CONFLICT)
      expect(purchaseService.purchase).toHaveBeenCalledWith({
        userId: 1,
        ...body
      })
      expect(validResponse.redirect).not.toHaveBeenCalled()
    })
  })
})
