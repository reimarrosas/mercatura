import express from 'express'
import { categoryHandlerFactory } from '@domain/category/handler'
import { validLogger } from '@shared/testing/generate-valid-inputs'
import { categoryServiceFactory } from '@domain/category/service'
import db from '@config/db'

const router = express.Router()

const categoryService = categoryServiceFactory(db)
const categoryHandler = categoryHandlerFactory(validLogger, categoryService)
router.get('/', categoryHandler.getAllProducts)
router.get('/:id/products', categoryHandler.getCategoryProducts)

export default router
