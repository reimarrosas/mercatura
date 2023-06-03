import { Comment, PrismaClient } from '@prisma/client'
import { Comment as CommentDTO, DeleteComment } from '@domain/comment/dto'

export interface ICommentService {
  createComment: (dto: CommentDTO) => Promise<Comment>
  updateComment: (dto: CommentDTO) => Promise<Comment>
  deleteComment: (dto: DeleteComment) => Promise<Comment | undefined>
}

export const commentServiceFactory = (db: PrismaClient): ICommentService => {
  const createComment = (dto: CommentDTO) =>
    db.comment.create({
      data: dto
    })

  const updateComment = async (dto: CommentDTO) =>
    db.comment.update({
      data: dto,
      where: { id: dto.id }
    })

  const deleteComment = async (dto: DeleteComment) => {
    try {
      return await db.comment.delete({
        where: dto
      })
    } catch (_err) {
      return undefined
    }
  }

  return {
    createComment,
    updateComment,
    deleteComment
  }
}
