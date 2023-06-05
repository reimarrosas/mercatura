import { z } from 'zod'
import { id } from '@shared/validators/id'

const nonZeroPositiveNumber = z.number().gt(0)

export const invoiceLineDto = z.object({
  productId: id,
  quantity: nonZeroPositiveNumber.int()
})

export type InvoiceLineDTO = z.infer<typeof invoiceLineDto>

export const invoiceDto = z.object({
  userId: id,
  invoiceLines: invoiceLineDto.array().nonempty()
})

export type InvoiceDTO = z.infer<typeof invoiceDto>
