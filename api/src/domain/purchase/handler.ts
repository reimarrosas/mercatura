import { ILogger } from '@config/logger'
import { IPurchaseService } from '@domain/purchase/service'
import { RequestHandler } from 'express'
import { invoiceDto } from '@domain/purchase/dto'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

export const purchaseHandlerFactory = (
  _logger: ILogger,
  purchaseService: IPurchaseService
) => {
  const purchase: RequestHandler = async (req, res) => {
    const result = invoiceDto.safeParse({
      userId: req.auth?.id,
      invoiceLines: req.body.invoiceLines
    })

    if (!result.success) {
      throw new AppError(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY,
        'Invalid request body schema'
      )
    }

    const url = await purchaseService.purchase(result.data)

    if (!url) {
      throw new AppError(
        HTTPStatusCodes.CONFLICT,
        'Cannot purchase products due to processing conflict'
      )
    }

    return res.redirect(303, url!)
  }

  return {
    purchase
  }
}
