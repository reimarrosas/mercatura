import { ILogger } from '@config/logger'
import { ICategoryService } from '@domain/category/service'
import { RequestHandler } from 'express'

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

  return {
    getAllProducts
  }
}
