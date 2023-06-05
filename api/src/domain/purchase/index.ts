import express from 'express'
import { authenticated } from '@domain/auth/middleware/authenticated'
import { purchaseHandlerFactory } from '@domain/purchase/handler'
import logger from '@config/logger'
import { purchaseServiceFactory } from '@domain/purchase/service'
import db from '@config/db'
import config from '@config/env'
import stripe from '@config/stripe'

const router = express.Router()

router.use(authenticated)

const purchaseService = purchaseServiceFactory(db, stripe, config)
const purchaseHandler = purchaseHandlerFactory(logger, purchaseService)
router.post('/', purchaseHandler.purchase)

export default router
