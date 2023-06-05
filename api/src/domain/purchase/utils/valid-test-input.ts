import { Invoice } from '@prisma/client'
import { InvoiceDTO } from '@domain/purchase/dto'

export const validInvoice: Invoice = {
  id: 1,
  userId: 1,
  status: 'PENDING',
  date: new Date('January, 1, 2023 03:24:00')
}

export const validInvoiceDto: InvoiceDTO = {
  userId: 1,
  invoiceLines: [
    { productId: 1, quantity: 1 },
    { productId: 2, quantity: 1 },
    { productId: 3, quantity: 1 }
  ]
}
