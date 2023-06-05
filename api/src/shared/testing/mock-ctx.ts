import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import Stripe from 'stripe'

export type Context = {
  prisma: PrismaClient
  stripe: Stripe
}

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
  stripe: DeepMockProxy<Stripe>
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
    stripe: mockDeep<Stripe>()
  }
}
