import { z } from 'zod'
import { id } from '@shared/validators/id'

export const comment = z.object({
  userId: id,
  productId: id,
  content: z.string().nonempty()
})

export type Comment = z.infer<typeof comment>
