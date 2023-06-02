import { z } from 'zod'
import { id } from '@shared/validators/id'

export const rating = z.object({
  productId: id,
  userId: id,
  value: z.number().int().min(1).max(5)
})

export type Rating = z.infer<typeof rating>
