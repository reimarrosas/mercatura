import express from 'express'
import { categoryHandlerFactory } from '@domain/category/handler'
import { categoryServiceFactory } from '@domain/category/service'
import db from '@config/db'
import logger from '@config/logger'

const router = express.Router()

const categoryService = categoryServiceFactory(db)
const categoryHandler = categoryHandlerFactory(logger, categoryService)
router.get('/', categoryHandler.getAllProducts)
router.get('/:id/products', categoryHandler.getCategoryProducts)

export default router
