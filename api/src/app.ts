import express from 'express'

require('express-async-errors')
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import config from '@config/env'
import { notFoundMiddleware } from '@shared/middlewares/not-found'
import { errorMiddleware } from '@shared/middlewares/error-handling'
import { authParserFactory } from '@shared/middlewares/auth-parser'

const app = express()

// Third-party middlewares
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

// Error handling middlewares
app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
