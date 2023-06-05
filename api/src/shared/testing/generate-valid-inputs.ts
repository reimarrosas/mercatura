import { IConfig } from '@config/env'
import { Response } from 'express'
import { ILogger } from '@config/logger'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/data-proxy'
import { assertType } from '@shared/assert-type'

export const validConfig = {
  token: {
    secret: '1testsecret1'
  },
  clientUrl: 'http://localhost:3000'
} as IConfig

export const validResponse: Response = assertType({
  status: jest.fn((_: unknown) => validResponse),
  send: jest.fn((_: unknown) => validResponse),
  redirect: jest.fn((_status: number, _url: string) => validResponse)
})

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
