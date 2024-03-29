import { jwtUtilsFactory } from '@/domain/auth/utils/jwt'
import { IConfig } from '@config/env'
import {
  validAuthData,
  validToken
} from '@/domain/auth/utils/valid-test-inputs'

describe('JWT Utils Unit Test', () => {
  const utils = jwtUtilsFactory({
    token: {
      secret: '1testsecret1'
    }
  } as IConfig)

  describe('extractPayload', () => {
    it('should return the payload on valid token', () => {
      // Arrange
      const token = validToken

      // Act
      const result = utils.extractPayload(token)

      // Assert
      expect(result).toEqual({
        id: 1,
        name: 'Sample User',
        email: 'sampleuser@email.com'
      })
    })

    it('should return undefined on invalid secret', () => {
      // Arrange
      const token =
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlNhbXBsZSBVc2VyIiwiZW1haWwiOiJzYW1wbGV1c2VyQGVtYWlsLmNvbSJ9.d90miUZaIDIHqKIKauFEL5E-ZoLPhyIq4BQLcRa2p93QfrWNfaQ-erD1ffzpn06LGhZBfvQyKsxhykRpS4FqhQ'

      // Act
      const result = utils.extractPayload(token)

      // Assert
      expect(result).toBeUndefined()
    })

    it('should return undefined on invalid payload schema', () => {
      // Arrange
      const token =
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ.WD32X-lMDACN4prVQ7ACq-aR_02Xl5tCDHuZH31mVx2-5TxJ99pqh0VF-UsYJFleZd3dikEOTl_IkundexaCUA'

      // Act
      const result = utils.extractPayload(token)

      // Assert
      expect(result).toBeUndefined()
    })
  })

  describe('createToken', () => {
    it('should return a token on valid payload', () => {
      // Arrange
      // Act
      const result = utils.createToken(validAuthData)

      // Assert
      expect(typeof result).toBe('string')
      expect(result).toMatch(
        /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/
      )
    })
  })
})
