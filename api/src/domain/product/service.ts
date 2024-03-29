import { PrismaClient, Product } from '@prisma/client'
import { ID } from '@shared/validators/id'

export interface IProductService {
  getAllProducts: () => Promise<Product[]>
  getProduct: (id: ID) => Promise<Product | undefined>
  searchProducts: (term: string) => Promise<Product[]>
}

export const productServiceFactory = (db: PrismaClient): IProductService => {
  const getAllProducts = async () =>
    db.product.findMany({
      include: {
        _count: {
          select: {
            Rating: true
          }
        }
      }
    })

  const getProduct = async (id: ID) => {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            Rating: true
          }
        },
        Comment: true
      }
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
      },
      include: {
        _count: {
          select: {
            Rating: true
          }
        }
      }
    })

  return {
    getAllProducts,
    getProduct,
    searchProducts
  }
}
