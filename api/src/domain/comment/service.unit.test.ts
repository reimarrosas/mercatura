import { Context, createMockContext, MockContext } from '@shared/testing/db-ctx'
import { assertType } from '@shared/assert-type'
import { validComment } from '@domain/comment/utils/valid-test-input'
import { Comment } from '@domain/comment/dto'
import { commentServiceFactory, ICommentService } from '@domain/comment/service'

describe('Comment Service Unit Test', () => {
  let mockCtx: MockContext
  let commentService: ICommentService

  beforeEach(() => {
    mockCtx = createMockContext()
    const ctx: Context = assertType(mockCtx)
    commentService = commentServiceFactory(ctx.prisma)
  })

  describe('createComment', () => {
    it('should return the created comment on valid input', async () => {
      // Arrange
      const comment: Comment = {
        userId: validComment.userId,
        productId: validComment.productId,
        content: validComment.content
      }
      mockCtx.prisma.comment.create.mockResolvedValue(validComment)

      // Act
      const result = await commentService.createComment(comment)

      // Assert
      expect(mockCtx.prisma.comment.create).toHaveBeenCalledWith({
        data: comment
      })
      expect(result).toEqual(validComment)
    })
  })
})
