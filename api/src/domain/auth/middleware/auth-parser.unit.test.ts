import { NextFunction, Request, Response } from 'express'
import { authParserFactory } from '@/domain/auth/middleware/auth-parser'
import { validConfig } from '@shared/testing/generate-valid-inputs'

describe('Auth Parsing Middleware Unit Test', () => {
  let req: Request

  beforeEach(() => {
    req = {
      headers: {
        authorization: undefined
      },
      auth: undefined
    } as Request
  })

  it('should assign AuthData to `req.auth`on valid Authorization Header', () => {
    // Arrange
    req.headers.authorization =
      'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlNhbXBsZSBVc2VyIiwiZW1haWwiOiJzYW1wbGV1c2VyQGVtYWlsLmNvbSJ9.X9cmtQ2JRT7LkNQZPB_ruxKt4cY6EV_9VzP5OkVb0Xu3aRc0Sv8cCFihdSEV82P0Aiqy0dv84S-fusSXCzeylQ'
    const authParser = authParserFactory(validConfig)
    const mockNext: NextFunction = jest.fn()

    // Act
    authParser(req, {} as Response, mockNext)

    // Assert
    expect(req.auth).toEqual({
      id: 1,
      name: 'Sample User',
      email: 'sampleuser@email.com'
    })
    expect(mockNext).toHaveBeenCalled()
  })

  it('should assign undefined to `req.auth` on malformed authorization header', () => {
    // Arrange
    req.headers.authorization = 'Foo Bar'
    const authParser = authParserFactory(validConfig)
    const mockNext: NextFunction = jest.fn()

    // Act
    authParser(req, {} as Response, mockNext)

    // Assert
    expect(req.auth).toBeUndefined()
    expect(mockNext).toHaveBeenCalled()
  })
})
