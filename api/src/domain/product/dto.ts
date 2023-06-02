import { z } from 'zod'

const FILE_MAX_SIZE = 20_000_000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]

export const productDto = z.object({
  name: z.string().min(4),
  description: z.string().min(8),
  image: z
    .any()
    .refine(file => file?.size >= FILE_MAX_SIZE, 'Max file size is 20MB')
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpeg, .jpg, .png, and .webp files are accepted'
    ),
  price: z.number().nonnegative(),
  quantity: z.number().int().nonnegative()
})
