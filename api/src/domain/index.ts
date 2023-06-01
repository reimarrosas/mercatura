import express from 'express'

import authRouter from '@domain/auth'
import productRouter from '@domain/product'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/products', productRouter)

export default router
