import express from 'express'
require('express-async-errors')
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import config from '@config/env'
import { AuthParserMiddleware } from '@shared/middlewares/auth-parser'
import { App } from '@config/app'
import { NotFoundMiddleware } from '@shared/middlewares/not-found'
import { ErrorHandlingMiddleware } from '@shared/middlewares/error-handling'
import logger from '@config/logger'

const app = new App(express())

app.useExternalMiddleware(
  cors({
    origin: config.clientUrl
  })
)

app.useExternalMiddleware(helmet())

app.useExternalMiddleware(morgan('dev'))

app.useAppMiddleware(new AuthParserMiddleware(config))

app.useAppMiddleware(new NotFoundMiddleware())
app.useAppMiddleware(new ErrorHandlingMiddleware(logger))

export default app
