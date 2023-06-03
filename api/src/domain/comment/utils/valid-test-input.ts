import { Comment } from '@prisma/client'

export const validComment: Comment = {
  id: 1,
  content: 'Sample Comment, Hello, World!',
  productId: 1,
  userId: 1,
  created_at: new Date('January, 1, 2023 03:24:00'),
  updated_at: new Date('January, 1, 2023 03:24:00')
}
