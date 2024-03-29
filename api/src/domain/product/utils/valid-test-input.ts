import { Product, Prisma, Comment } from '@prisma/client'

export type ProductWithRating = Product & {
  Rating: number
}

export const validProductList: ProductWithRating[] = [
  {
    id: 1,
    name: 'Sample Product 1',
    image:
      'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_large.png?format=webp&v=1530129292',
    price: new Prisma.Decimal(549.99),
    created_at: new Date('January, 1, 2023 03:24:00'),
    updated_at: new Date('January, 1, 2023 03:24:00'),
    quantity: 100,
    description: 'A Sample Product 1 Description',
    categoryId: 1,
    Rating: 4.8
  },
  {
    id: 2,
    name: 'Sample Product 2',
    image:
      'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_large.png?format=webp&v=1530129292',
    price: new Prisma.Decimal(549.99),
    created_at: new Date('January, 1, 2023 03:24:00'),
    updated_at: new Date('January, 1, 2023 03:24:00'),
    quantity: 100,
    description: 'A Sample Product 2 Description',
    categoryId: 1,
    Rating: 4.2
  },
  {
    id: 3,
    name: 'Sample Product 3',
    image:
      'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_large.png?format=webp&v=1530129292',
    price: new Prisma.Decimal(549.99),
    created_at: new Date('January, 1, 2023 03:24:00'),
    updated_at: new Date('January, 1, 2023 03:24:00'),
    quantity: 100,
    description: 'A Sample Product 3 Description',
    categoryId: 2,
    Rating: 4.5
  }
]

export type ProductWithRatingAndComments = ProductWithRating & {
  Comments: Comment[]
}
export const validSingleProduct: ProductWithRatingAndComments = {
  ...validProductList[0]!,
  Comments: [
    {
      id: 1,
      userId: 1,
      productId: 1,
      created_at: new Date('January, 1, 2023 03:24:00'),
      updated_at: new Date('January, 1, 2023 03:24:00'),
      content: 'Sample Comment 1'
    },
    {
      id: 2,
      userId: 1,
      productId: 1,
      created_at: new Date('January, 1, 2023 03:24:00'),
      updated_at: new Date('January, 1, 2023 03:24:00'),
      content: 'Sample Comment 2'
    },
    {
      id: 1,
      userId: 1,
      productId: 1,
      created_at: new Date('January, 1, 2023 03:24:00'),
      updated_at: new Date('January, 1, 2023 03:24:00'),
      content: 'Sample Comment 1'
    }
  ]
}
