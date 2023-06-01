import { Context, createMockContext, MockContext } from '@shared/testing/db-ctx'
import { authServiceFactory } from '@/domain/auth/auth.service'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/data-proxy'
import { validPrismaClientKnownError } from '@shared/testing/generate-valid-inputs'
import {
  validAuthData,
  validLoginDto,
  validSignupDto,
  validUserEntity
} from '@/domain/auth/utils/valid-test-inputs'
import { assertType } from '@shared/assert-type'

describe('Auth Service Unit Test', () => {
  let mockCtx: MockContext
  let ctx: Context

  beforeEach(() => {
    mockCtx = createMockContext()
    ctx = assertType(mockCtx)
  })

  describe('createUser', () => {
    it('should return an IAuthData object on successful creation', async () => {
      // Arrange
      mockCtx.prisma.user.create.mockResolvedValue(validAuthData as any)
      const authService = authServiceFactory(ctx.prisma)

      // Act
      const result = await authService.createUser(validSignupDto)

      // Assert
      expect(result).toEqual(validAuthData)
      expect(mockCtx.prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            ...validSignupDto,
            password: expect.stringContaining('$2b$10$')
          }
        })
      )
    })

    it('should throw a PrismaClientKnownError on email unique constraint conflict', async () => {
      // Arrange
      mockCtx.prisma.user.create.mockRejectedValue(validPrismaClientKnownError)
      const authService = authServiceFactory(ctx.prisma)

      // Act
      const fn = () => authService.createUser(validSignupDto)

      // Assert
      await expect(fn).rejects.toThrowError(PrismaClientKnownRequestError)
    })
  })

  describe('loginUser', () => {
    it('should return an IAuthData object on successful login', async () => {
      // Arrange
      mockCtx.prisma.user.findUnique.mockResolvedValue(validUserEntity)
      const authService = authServiceFactory(ctx.prisma)

      // Act
      const result = await authService.loginUser(validLoginDto)

      // Assert
      expect(result).toEqual(validAuthData)
      expect(mockCtx.prisma.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            email: validLoginDto.email
          }
        })
      )
    })

    it('should return undefined on non-existent user', async () => {
      // Arrange
      mockCtx.prisma.user.findUnique.mockResolvedValue(null)
      const authService = authServiceFactory(ctx.prisma)

      // Act
      const result = await authService.loginUser(validLoginDto)

      // Assert
      expect(result).toBeUndefined()
      expect(mockCtx.prisma.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            email: validLoginDto.email
          }
        })
      )
    })

    it('should return undefined on invalid password', async () => {
      // Arrange
      mockCtx.prisma.user.findUnique.mockResolvedValue({
        ...validUserEntity,
        password: '$2b$10$iNvn1QmwO2WJUTN9gPvO2u/LXESqKlgtlRUAZloZW.zjFjUdK6Iw6'
      })
      const authService = authServiceFactory(ctx.prisma)

      // Act
      const result = await authService.loginUser(validLoginDto)

      // Assert
      expect(result).toBeUndefined()
      expect(mockCtx.prisma.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            email: validLoginDto.email
          }
        })
      )
    })
  })
})
