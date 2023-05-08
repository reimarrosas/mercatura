import { Category, Product } from "@prisma/client"
import { prisma } from "../database";

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