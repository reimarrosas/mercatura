import { InvoiceDTO, InvoiceLineDTO } from '@domain/purchase/dto'
import { PrismaClient, Product } from '@prisma/client'
import Stripe from 'stripe'
import { IConfig } from '@config/env'

export interface IPurchaseService {
  purchase: (dto: InvoiceDTO) => Promise<string | undefined>
}

const findQuantityById = (dto: InvoiceLineDTO[], id: number) =>
  dto.find(line => line.productId === id)!.quantity

const mapProductsToInvoiceLines = (
  dto: InvoiceLineDTO[],
  products: Product[]
) =>
  products.map(product => ({
    price: product.price,
    quantity: findQuantityById(dto, product.id),
    productId: product.id
  }))

export const purchaseServiceFactory = (
  db: PrismaClient,
  stripe: Stripe,
  config: IConfig
): IPurchaseService => {
  const findProductsWithIdList = (ids: number[]) =>
    db.product.findMany({ where: { id: { in: ids } } })

  const createPendingInvoice = async (dto: InvoiceDTO, products: Product[]) => {
    const submitInvoice = db.invoice.create({
      include: { InvoiceLine: true },
      data: {
        userId: dto.userId,
        InvoiceLine: {
          create: mapProductsToInvoiceLines(dto.invoiceLines, products)
        }
      }
    })

    const reduceProductQuantity = products.map(product =>
      db.product.update({
        where: { id: product.id },
        data: {
          quantity:
            product.quantity - findQuantityById(dto.invoiceLines, product.id)
        }
      })
    )

    return await db.$transaction([submitInvoice, ...reduceProductQuantity])
  }

  const purchase = async (dto: InvoiceDTO) => {
    const products = await findProductsWithIdList(
      dto.invoiceLines.map(line => line.productId)
    )

    if (products.length !== dto.invoiceLines.length) return undefined

    try {
      await createPendingInvoice(dto, products)
    } catch (err) {
      return undefined
    }

    const session = await stripe.checkout.sessions.create({
      line_items: products.map(product => ({
        quantity: findQuantityById(dto.invoiceLines, product.id),
        price_data: {
          unit_amount_decimal: product.price.toFixed(2),
          currency: 'cad',
          product_data: {
            name: product.name,
            description: product.name,
            images: [product.image]
          }
        }
      })),
      success_url: `${config.clientUrl}/purchase/result?success`,
      cancel_url: `${config.clientUrl}/purchase/result?cancel`
    })

    return session.url ?? undefined
  }

  return {
    purchase
  }
}
