import { sessionMiddleware } from './utils/config'

import express from 'express'
require('express-async-errors')
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express();
app.use(cors({
    origin: process.env['CLIENT_URL'],
    credentials: true
}))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

app.use(sessionMiddleware)

app.get('/', (_req, res) => {
    res.send({
        message: 'Hello, World!'
    })
})

export default app;