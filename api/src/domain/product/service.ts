import { PrismaClient, Product } from '@prisma/client'
import { ID } from '@shared/validators/id'

export interface IProductService {
  getAllProducts: () => Promise<Product[]>
  getProduct: (id: ID) => Promise<Product | undefined>
  searchProducts: (term: string) => Promise<Product[]>
}

export const productServiceFactory = (db: PrismaClient): IProductService => {
  const getAllProducts = async () => db.product.findMany()

  const getProduct = async (id: ID) => {
    const product = await db.product.findUnique({
      where: { id }
    })

    return product ?? undefined
  }

  const searchProducts = async (term: string) =>
    db.product.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } }
        ]
      }
    })

  return {
    getAllProducts,
    getProduct,
    searchProducts
  }
}
