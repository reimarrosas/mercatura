import express from 'express'

import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import config from '@config/env'
import { notFoundMiddleware } from '@shared/middleware/not-found'
import { errorMiddleware } from '@shared/middleware/error-handling'
import { authParserFactory } from '@domain/auth/middleware/auth-parser'
import domainRouters from '@domain/index'

const app = express()

// Third-party middleware
app.use(
  cors({
    origin: config.clientUrl
  })
)
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

// App Middlewares
app.use(authParserFactory(config))

// NOTE: Put routes HERE
app.use(domainRouters)

// Error handling middleware
app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
