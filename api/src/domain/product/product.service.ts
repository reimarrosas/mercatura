import { PrismaClient, Product } from '@prisma/client'

export interface IProductService {
  getAllProducts: () => Promise<Product[]>
  getProduct: (id: number) => Promise<Product | undefined>
  searchProducts: (term: string) => Promise<Product[]>
}

export const productServiceFactory = (db: PrismaClient): IProductService => {
  const getAllProducts = async () => db.product.findMany()

  const getProduct = async (id: number) => {
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
