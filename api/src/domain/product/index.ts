import express from 'express'
import { productHandlerFactory } from '@domain/product/handler'
import logger from '@config/logger'
import { productServiceFactory } from '@domain/product/service'
import db from '@config/db'

const router = express.Router()

const productService = productServiceFactory(db)
const { getAllProducts, getProduct, searchProducts } = productHandlerFactory(
  logger,
  productService
)
router.get('/', getAllProducts)
router.get('/:id', getProduct)
router.get('/search', searchProducts)

export default router
