import { Comment, PrismaClient } from '@prisma/client'
import { Comment as CommentDTO } from '@domain/comment/dto'

export interface ICommentService {
  createComment: (dto: CommentDTO) => Promise<Comment>
  updateComment: (dto: CommentDTO) => Promise<Comment>
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

  return {
    createComment,
    updateComment
  }
}
