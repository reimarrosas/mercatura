import { validAuthData } from '@/domain/auth/utils/valid-test-inputs'
import { Request, Response } from 'express'
import { authenticated } from '@/domain/auth/middleware/authenticated'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

describe('Authenticated Middleware Unit Test', () => {
  it('should proceed to the next middleware on valid auth data', () => {
    // Arrange
    const req = { auth: validAuthData } as Request
    const mockNext = jest.fn()

    // Act
    authenticated(req, {} as Response, mockNext)

    // Assert
    expect(mockNext).toHaveBeenCalled()
  })

  it('should throw AppError on missing auth data', () => {
    // Arrange
    const req = { auth: undefined } as Request
    const mockNext = jest.fn()
    let expectedError: AppError

    // Act
    try {
      authenticated(req, {} as Response, mockNext)
    } catch (err) {
      expectedError = err as AppError
    }

    // Assert
    expect(expectedError!).toBeInstanceOf(AppError)
    expect(expectedError!.statusCode).toBe(HTTPStatusCodes.UNAUTHORIZED)
    expect(mockNext).not.toHaveBeenCalled()
  })
})
