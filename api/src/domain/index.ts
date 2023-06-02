import express from 'express'

import authRouter from '@domain/auth'
import productRouter from '@domain/product'
import categoryRouter from '@domain/category'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/products', productRouter)
router.use('/categories', categoryRouter)

export default router
