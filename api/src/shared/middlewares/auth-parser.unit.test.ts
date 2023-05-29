import { Request, Response } from 'express'
import { AuthParserMiddleware } from '@shared/middlewares/auth-parser'
import { IConfig } from '@type/config'
import { JwtHelper } from '@utils/jwt-helper'

describe('AuthParserMiddleware Unit Test', () => {
  let authParserMiddleware: AuthParserMiddleware

  beforeAll(() => {
    authParserMiddleware = new AuthParserMiddleware(
      new JwtHelper({
        token: {
          secret: 'secret'
        }
      } as IConfig)
    )
  })
  it('should set `req.auth` as a string when passed a valid secret and bearer token', () => {
    // Arrange
    const req = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.nZU_gPcMXkWpkCUpJceSxS7lSickF0tTImHhAR949Z-Nt69LgW8G6lid-mqd9B579tYM8C4FN2jdhR2VRMsjtA'
      }
    } as Request
    const mockNext = jest.fn()

    // Act
    authParserMiddleware.handler(req, {} as Response, mockNext)

    // Assert
    expect(req.auth).not.toBeUndefined()
    expect(mockNext).toHaveBeenCalled()
  })

  it('should return undefined on malformed header', () => {
    // Arrange
    const req = {
      headers: {
        authorization:
          'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.nZU_gPcMXkWpkCUpJceSxS7lSickF0tTImHhAR949Z-Nt69LgW8G6lid-mqd9B579tYM8C4FN2jdhR2VRMsjtA'
      }
    } as Request
    const mockNext = jest.fn()

    // Act
    authParserMiddleware.handler(req, {} as Response, mockNext)

    // Assert
    expect(req.auth).toBeUndefined()
    expect(mockNext).toHaveBeenCalled()
  })

  it('should return undefined on wrong secret', () => {
    // Arrange
    const req = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.-_cBUFRwiSx8tICnU5Ghc4QGSULPFo4tcEb_4Z1eJSF77cgUBKyE6Ucsx0NGQjVkfA9y2q8igY3Sh-RCjD0VFA'
      }
    } as Request
    const mockNext = jest.fn()

    // Act
    authParserMiddleware.handler(req, {} as Response, mockNext)

    // Assert
    expect(req.auth).toBeUndefined()
    expect(mockNext).toHaveBeenCalled()
  })
})
