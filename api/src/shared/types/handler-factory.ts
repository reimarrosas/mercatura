import { RequestHandler } from 'express'

export type HandlerFactoryReturnType = Record<string, RequestHandler>
