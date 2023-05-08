import express from 'express'

import { getAllCategories, getAllProducts, getCategoryProducts, getSingleCategory, getSingleProduct, login, signup } from "./controllers";

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.get('/products', getAllProducts)
router.get('/products/:id', getSingleProduct)

router.get('/categories', getAllCategories)
router.get('/categories/:id', getSingleCategory)
router.get('/categories/:id/products', getCategoryProducts)

export default router