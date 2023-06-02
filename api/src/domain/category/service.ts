import { Category, PrismaClient } from '@prisma/client'

export interface ICategoryService {
  getAllCategories: () => Promise<Category[]>
}

export const categoryServiceFactory = (db: PrismaClient): ICategoryService => {
  const getAllCategories = async () => db.category.findMany()

  return {
    getAllCategories
  }
}
