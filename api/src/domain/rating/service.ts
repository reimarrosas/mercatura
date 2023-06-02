import { Rating } from '@domain/rating/dto'
import { PrismaClient } from '@prisma/client'

export interface IRatingService {
  addRating: (rating: Rating) => Promise<Rating>
  updateRating: (rating: Rating) => Promise<Rating>
}

export const ratingServiceFactory = (db: PrismaClient): IRatingService => {
  const addRating = async (rating: Rating) =>
    db.rating.create({
      data: rating
    })

  const updateRating = async (rating: Rating) =>
    db.rating.update({
      data: { value: rating.value },
      where: {
        productId_userId: {
          userId: rating.userId,
          productId: rating.productId
        }
      }
    })

  return {
    addRating,
    updateRating
  }
}
