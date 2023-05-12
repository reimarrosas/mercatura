import { Category, Comment, Product } from "@prisma/client"
import { prisma } from "../database";
import supertest from "supertest";
import app from "../app";

type MappedProduct = Omit<Product, 'price' | 'created_at' | 'updated_at'> & {
    created_at: string;
    updated_at: string;
    price: string;
}

type MappedCategory =  Omit<Category, 'created_at' | 'updated_at'> & {
    created_at: string;
    updated_at: string;
    products?: MappedProduct;
}

export const productToJson = (product: Product): MappedProduct => ({
    ...product,
    price: product.price.toString(),
    created_at: product.created_at.toISOString(),
    updated_at: product.updated_at.toISOString()
})

export const categoriesToJson = (category: Category): MappedCategory => ({
    ...category,
    created_at: category.created_at.toISOString(),
    updated_at: category.updated_at.toISOString(),
})

export const commentsToJson = (comment: Comment) => ({
  ...comment,
  created_at: comment.created_at.toISOString(),
  updated_at: comment.updated_at.toISOString()
})

export const extractCookieAndUser = async () => {
    const initialUser = {
        name: 'Sample User 2',
        email: 'sample2@test.com',
        password: '$argon2id$v=19$m=16,t=3,p=1$cmtxaXh6VG94dGpnR1J3SA$WGx7uswP+F8gj8s3JW/opQkvdw'
    }

    const user = await prisma.user.create({ data: initialUser })

    const response = await supertest(app).post('/api/v1/login').send({
        email: 'sample2@test.com',
        password: 'Sample-test123'
    })

    return {
      userId: user.id,
      authCookie: response.headers['set-cookie']
    }
}

export const truncateDB = async () => {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tablenames) {
    if (tablename !== "_prisma_migrations") {
      try {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }
}