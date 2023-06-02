import { Category } from '@prisma/client'

export const validCategoryList: Category[] = [
  {
    id: 1,
    name: 'Category 1',
    image:
      'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1_large.png?format=webp&v=1530129113',
    description: 'Category Description 1',
    created_at: new Date('January, 1, 2023 03:24:00'),
    updated_at: new Date('January, 1, 2023 03:24:00')
  },
  {
    id: 2,
    name: 'Category 2',
    image:
      'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1_large.png?format=webp&v=1530129113',
    description: 'Category Description 2',
    created_at: new Date('January, 1, 2023 03:24:00'),
    updated_at: new Date('January, 1, 2023 03:24:00')
  },
  {
    id: 3,
    name: 'Category 3',
    image:
      'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1_large.png?format=webp&v=1530129113',
    description: 'Category Description 3',
    created_at: new Date('January, 1, 2023 03:24:00'),
    updated_at: new Date('January, 1, 2023 03:24:00')
  }
]
