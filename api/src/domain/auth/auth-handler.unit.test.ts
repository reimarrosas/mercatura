import {
  validLogger,
  validPrismaClientKnownError,
  validResponse,
  validSignupDto
} from '@shared/utils/testing/generate-valid-inputs'
import { Request } from 'express'
import { authHandlerFactory } from '@/domain/auth/auth.handler'
import { IAuthService } from '@/domain/auth/auth.service'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

describe('Auth Handlers Unit Test', () => {
  describe('Login Handler', () => {})

  describe('Signup Handler', () => {
    let authService: IAuthService

    beforeEach(() => {
      authService = {
        createUser: undefined
      } as unknown as IAuthService
    })

    it('should return 201 Success on valid Signup credentials', async () => {
      // Arrange
      const req = { body: validSignupDto } as Request
      authService.createUser = jest.fn()
      const { signup } = authHandlerFactory(validLogger, authService)

      // Act
      await signup!(req, validResponse, () => {})

      // Assert
      expect(authService.createUser).toHaveBeenCalled()
      expect(validResponse.status).toHaveBeenCalledWith(201)
      expect(validResponse.send).toHaveBeenCalledWith({
        message: 'User creation successful'
      })
    })

    it('should throw AppError on invalid body schema', async () => {
      // Arrange
      const req = { body: {} } as Request
      authService.createUser = jest.fn()
      const { signup } = authHandlerFactory(validLogger, authService)
      let expectedError: AppError

      // Act
      try {
        await signup!(req, validResponse, () => {})
      } catch (err) {
        expectedError = err as AppError
      }

      // Assert
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY
      )
      expect(authService.createUser).not.toHaveBeenCalled()
    })

    it('should return 403 on existing email', async () => {
      // Arrange
      const req = { body: validSignupDto } as Request
      authService.createUser = jest
        .fn()
        .mockRejectedValue(validPrismaClientKnownError)
      const { signup } = authHandlerFactory(validLogger, authService)
      let expectedError: AppError

      // Act
      try {
        await signup!(req, validResponse, () => {})
      } catch (err) {
        expectedError = err as AppError
      }

      // Assert
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(HTTPStatusCodes.FORBIDDEN)
    })
  })
})
