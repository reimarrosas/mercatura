import { ILogger } from '@config/logger'
import { ICategoryService } from '@domain/category/service'
import { RequestHandler } from 'express'
import { id } from '@shared/validators/id'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

export const categoryHandlerFactory = (
  _logger: ILogger,
  categoryService: ICategoryService
) => {
  const getAllProducts: RequestHandler = async (_req, res) => {
    const data = await categoryService.getAllCategories()

    return res.send({
      message: 'Fetching Categories successful',
      data
    })
  }

  const getCategoryProducts: RequestHandler = async (req, res) => {
    const result = id.safeParse(req.params['id'])

    if (!result.success) {
      throw new AppError(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY,
        'Category ID is invalid'
      )
    }

    const data = await categoryService.getCategoryProducts(result.data)

    return res.send({
      message: `Fetching Category ${result.data} related Products successful`,
      data
    })
  }

  return {
    getAllProducts,
    getCategoryProducts
  }
}
