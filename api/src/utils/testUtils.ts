import { prisma } from "../database";
import supertest from "supertest";
import app from "../app";
import { Decimal } from "@prisma/client/runtime/library";

export const entityToJson = (entity: Record<string, unknown>): Record<string, unknown> => {
  const ret: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(entity)) {
    if (value instanceof Date) {
      ret[key] = value.toISOString()
    } else if (value instanceof Decimal) {
      ret[key] = value.toString()
    } else if (typeof value === 'object' && !Array.isArray(value) && value) {
      ret[key] = entityToJson(value as Record<string, unknown>)
    } else if (Array.isArray(value) && typeof value[0] === 'object') {
      ret[key] = value.map(entityToJson)
    } else {
      ret[key] = value
    }
  }

  return ret
}

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