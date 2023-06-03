import { z } from 'zod'
import { id } from '@shared/validators/id'

export const comment = z.object({
  id: id.optional(),
  userId: id,
  productId: id,
  content: z.string().nonempty()
})

export type Comment = z.infer<typeof comment>

export const deleteComment = z.object({
  id,
  userId: id
})

export type DeleteComment = z.infer<typeof deleteComment>
