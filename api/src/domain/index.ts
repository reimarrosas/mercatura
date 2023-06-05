import express from 'express'

import authRouter from '@domain/auth'
import productRouter from '@domain/product'
import categoryRouter from '@domain/category'
import commentRouter from '@domain/comment'
import ratingRouter from '@domain/rating'
import purchaseRouter from '@domain/purchase'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/products', productRouter)
router.use('/categories', categoryRouter)
router.use('/comments', commentRouter)
router.use('/ratings', ratingRouter)
router.use('/purchase', purchaseRouter)

export default router
