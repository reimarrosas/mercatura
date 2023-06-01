import { IConfig } from '@config/env'
import { Response } from 'express'
import { ILogger } from '@config/logger'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/data-proxy'

export const validConfig = {
  token: {
    secret: '1testsecret1'
  }
} as IConfig

export const validResponse = {
  status: jest.fn((_: unknown) => validResponse),
  send: jest.fn((_: unknown) => validResponse)
} as unknown as Response

export const validLogger: ILogger = {
  error: (...params: any[]) => {
    params = params
  },
  debug: (...params: any[]) => {
    params = params
  },
  fatal: (...params: any[]) => {
    params = params
  },
  info: (...params: any[]) => {
    params = params
  },
  trace: (...params: any[]) => {
    params = params
  },
  warn: (...params: any[]) => {
    params = params
  }
}

export const validPrismaClientKnownError = new PrismaClientKnownRequestError(
  'Unique constraint failed on the user_email_unique',
  {
    code: 'P2002',
    meta: {},
    clientVersion: ''
  }
)
