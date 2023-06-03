import express from 'express'
import { authenticated } from '@domain/auth/middleware/authenticated'
import { ratingHandlerFactory } from '@domain/rating/handler'
import logger from '@config/logger'
import { ratingServiceFactory } from '@domain/rating/service'
import db from '@config/db'

const router = express.Router()

router.use(authenticated)

const ratingService = ratingServiceFactory(db)
const ratingHandler = ratingHandlerFactory(logger, ratingService)
router.post('/', ratingHandler.addRating)
router.put('/', ratingHandler.updateRating)

export default router
