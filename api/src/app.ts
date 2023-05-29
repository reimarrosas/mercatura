import express from 'express'
require('express-async-errors')
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import config from '@config/env'
import { AuthParserMiddleware } from '@shared/middlewares/auth-parser'
import { AppWrapper } from '@utils/app-wrapper'
import { NotFoundMiddleware } from '@shared/middlewares/not-found'
import { ErrorHandlingMiddleware } from '@shared/middlewares/error-handling'
import logger from '@config/logger'
import { JwtHelper } from '@utils/jwt-helper'

const app = new AppWrapper(express())

app.useExternalMiddleware(
  cors({
    origin: config.clientUrl
  })
)

app.useExternalMiddleware(helmet())

app.useExternalMiddleware(morgan('dev'))

app.useAppMiddleware(new AuthParserMiddleware(new JwtHelper(config)))

app.useAppMiddleware(new NotFoundMiddleware())
app.useAppMiddleware(new ErrorHandlingMiddleware(logger))

export default app
