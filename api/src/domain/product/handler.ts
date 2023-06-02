import { IProductService } from '@domain/product/service'
import { ILogger } from '@config/logger'
import { RequestHandler } from 'express'
import { id } from '@shared/validators/id'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

export const productHandlerFactory = (
  logger: ILogger,
  productService: IProductService
) => {
  const getAllProducts: RequestHandler = async (_req, res) => {
    const products = await productService.getAllProducts()

    logger.info('All products fetched')

    return res.send({
      message: 'Fetching all products successful',
      data: products
    })
  }

  const getProduct: RequestHandler = async (req, res) => {
    const productId = id.safeParse(req.params['id'])

    if (!productId.success) {
      throw new AppError(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY,
        'Product ID is invalid'
      )
    }

    const product = await productService.getProduct(productId.data)

    if (!product) {
      throw new AppError(
        HTTPStatusCodes.NOT_FOUND,
        `Product ${productId.data} not found`
      )
    }

    return res.send({
      message: `Fetching Product ${productId.data} successful`,
      data: product
    })
  }

  const searchProducts: RequestHandler = async (req, res) => {
    const { term } = req.query

    if (typeof term !== 'string') {
      throw new AppError(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY,
        'Invalid search term format'
      )
    }

    const products = await productService.searchProducts(term)

    return res.send({
      message: `Fetching Products related to '${term}' successful`,
      data: products
    })
  }

  return {
    getAllProducts,
    getProduct,
    searchProducts
  }
}
