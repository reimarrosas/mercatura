import {
  validLogger,
  validPrismaClientKnownError,
  validResponse
} from '@shared/testing/generate-valid-inputs'
import { Request } from 'express'
import { authHandlerFactory } from '@/domain/auth/auth.handler'
import { IAuthService } from '@/domain/auth/auth.service'
import { AppError, HTTPStatusCodes } from '@shared/app-error'
import {
  validAuthData,
  validJwtUtils,
  validLoginDto,
  validSignupDto
} from '@/domain/auth/utils/valid-test-inputs'
import { assertType } from '@shared/assert-type'

describe('Auth Handlers Unit Test', () => {
  describe('Login Handler', () => {
    let authService: IAuthService

    beforeEach(() => {
      authService = assertType({
        loginUser: undefined
      })
    })

    it('should return 200 OK on valid login credentials', async () => {
      // Arrange
      const req = { body: validLoginDto } as Request
      authService.loginUser = jest.fn().mockResolvedValue(validAuthData)
      const { login } = authHandlerFactory(
        validLogger,
        authService,
        validJwtUtils
      )

      // Act
      await login!(req, validResponse, () => {})

      // Assert
      expect(authService.loginUser).toHaveBeenCalledWith(validLoginDto)
      expect(validResponse.send).toHaveBeenCalledWith({
        message: 'User login successful',
        token: expect.stringMatching(
          /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/
        )
      })
    })

    it('should throw AppError on invalid body schema', async () => {
      // Arrange
      const req = { body: {} } as Request
      authService.loginUser = jest.fn()
      const { login } = authHandlerFactory(
        validLogger,
        authService,
        validJwtUtils
      )
      let expectedError: AppError

      // Act
      try {
        await login!(req, validResponse, () => {})
      } catch (err) {
        expectedError = err as AppError
      }

      // Assert
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY
      )
      expect(authService.loginUser).not.toHaveBeenCalled()
    })

    it('should throw AppError on non-existent user', async () => {
      // Arrange
      const req = { body: validLoginDto } as Request
      authService.loginUser = jest.fn().mockResolvedValue(undefined)
      const { login } = authHandlerFactory(
        validLogger,
        authService,
        validJwtUtils
      )
      let expectedError: AppError

      // Act
      try {
        await login!(req, validResponse, () => {})
      } catch (err) {
        expectedError = err as AppError
      }

      // Assert
      expect(expectedError!).toBeInstanceOf(AppError)
      expect(expectedError!.statusCode).toBe(HTTPStatusCodes.FORBIDDEN)
    })
  })

  describe('Signup Handler', () => {
    let authService: IAuthService

    beforeEach(() => {
      authService = assertType({
        createUser: undefined
      })
    })

    it('should return 201 Success on valid Signup credentials', async () => {
      // Arrange
      const req = { body: validSignupDto } as Request
      authService.createUser = jest.fn()
      const { signup } = authHandlerFactory(
        validLogger,
        authService,
        validJwtUtils
      )

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
      const { signup } = authHandlerFactory(
        validLogger,
        authService,
        validJwtUtils
      )
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
      const { signup } = authHandlerFactory(
        validLogger,
        authService,
        validJwtUtils
      )
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
