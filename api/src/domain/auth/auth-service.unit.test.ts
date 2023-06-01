import {
  Context,
  createMockContext,
  MockContext
} from '@shared/utils/testing/db-ctx'
import { authServiceFactory } from '@/domain/auth/auth.service'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/data-proxy'
import {
  validAuthData,
  validPrismaClientKnownError,
  validSignupDto
} from '@shared/utils/testing/generate-valid-inputs'

describe('Auth Service Unit Test', () => {
  let mockCtx: MockContext
  let ctx: Context

  beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
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
      mockCtx.prisma.user.fin

      // Act
      // Assert
    })
  })
})
