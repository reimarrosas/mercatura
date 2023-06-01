import express from 'express'

require('express-async-errors')
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import config from '@config/env'
import { notFoundMiddleware } from '@shared/middleware/not-found'
import { errorMiddleware } from '@shared/middleware/error-handling'
import { authParserFactory } from '@/domain/auth/middleware/auth-parser'

const app = express()

// Third-party middleware
app.use(
  cors({
    origin: config.clientUrl
  })
)
app.use(helmet())
app.use(morgan('dev'))

// App Middlewares
app.use(authParserFactory(config))

// NOTE: Put routes HERE
// app.use()

// Error handling middleware
app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
