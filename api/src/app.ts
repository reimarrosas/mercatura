import express from 'express'
require('express-async-errors')
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

if (process.env['NODE_ENV'] !== 'production') {
    require('dotenv').config({
        path: process.env['NODE_ENV'] === 'testing' ? '.env.test.local' : undefined
    })
}

const app = express();
app.use(cors({
    origin: process.env['CLIENT_URL'],
    credentials: true
}))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

app.get('/', (_req, res) => {
    res.send({
        message: 'Hello, World!'
    })
})

export default app;