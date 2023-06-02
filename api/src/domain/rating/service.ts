import { Rating } from '@domain/rating/dto'
import { PrismaClient } from '@prisma/client'

export interface IRatingService {
  addRating: (rating: Rating) => Promise<Rating>
}

export const ratingServiceFactory = (db: PrismaClient): IRatingService => {
  const addRating = async (rating: Rating) =>
    db.rating.create({
      data: rating
    })

  return {
    addRating
  }
}
