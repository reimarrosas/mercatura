import { User } from '@prisma/client'
import { jwtUtilsFactory } from '@/domain/auth/utils/jwt'
import config, { IConfig } from '@config/env'

export const validAuthData = {
  id: 1,
  name: 'Sample User',
  email: 'sampleuser@email.com'
}

export const validSignupDto = {
  name: 'Sample User',
  email: 'sampleuser@email.com',
  password: 'Sample-Password1'
}

export const validLoginDto = {
  email: 'sampleuser@email.com',
  password: 'Sample-Password1'
}

export const validUserEntity: User = {
  ...validAuthData,
  password: '$2b$10$XNVKa3/NnFJ0hQZ5vNfdbOMiGncG612OLu4If5X9BscEED6umAgme'
}

export const validToken =
  'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlNhbXBsZSBVc2VyIiwiZW1haWwiOiJzYW1wbGV1c2VyQGVtYWlsLmNvbSIsImlhdCI6MTY4NTYxNzE1NiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwic3ViIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIn0.BmQrAc04vNxi6x45vJTrSJyJ1JHcqTfexBAf0bzDQjM4e533Op6Mj1IJ1BYHiVzU6dqHgyqCOOpcyoiagmyr0w'

export const validJwtUtils = jwtUtilsFactory({
  token: {
    secret: '1testsecret1',
    options: config.token.options
  }
} as IConfig)
