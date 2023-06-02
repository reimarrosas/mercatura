import { Category, PrismaClient, Product } from '@prisma/client'
import { ID } from '@shared/validators/id'

export interface ICategoryService {
  getAllCategories: () => Promise<Category[]>
  getCategoryProducts: (id: ID) => Promise<Product[]>
}

export const categoryServiceFactory = (db: PrismaClient): ICategoryService => {
  const getAllCategories = async () => db.category.findMany()

  const getCategoryProducts = async (id: ID) => {
    const result = await db.category.findUnique({
      where: { id },
      include: {
        products: true
      }
    })

    return result?.products ?? []
  }

  return {
    getAllCategories,
    getCategoryProducts
  }
}
