import express from 'express'

import authRouter from '@domain/auth'

const router = express.Router()

router.use('/auth', authRouter)

export default router
