import { validAuthData } from '@/domain/auth/utils/valid-test-inputs'
import { NextFunction, Request, Response } from 'express'
import { AppError, HTTPStatusCodes } from '@shared/app-error'
import { guest } from '@/domain/auth/middleware/guest'

describe('Guest Middleware Unit Test', () => {
  let mockNext: NextFunction

  beforeEach(() => {
    mockNext = jest.fn()
  })

  it('should proceed to the next middleware on missing auth data', () => {
    // Arrange
    const req = { auth: undefined } as Request

    // Act
    guest(req, {} as Response, mockNext)

    // Assert
    expect(mockNext).toHaveBeenCalled()
  })

  it('should throw AppError on valid auth data', () => {
    // Arrange
    const req = { auth: validAuthData } as Request
    let expectedError: AppError

    // Act
    try {
      guest(req, {} as Response, mockNext)
    } catch (err) {
      expectedError = err as AppError
    }

    // Assert
    expect(expectedError!).toBeInstanceOf(AppError)
    expect(expectedError!.statusCode).toBe(HTTPStatusCodes.CONFLICT)
    expect(mockNext).not.toHaveBeenCalled()
  })
})
