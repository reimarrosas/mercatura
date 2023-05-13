import express from 'express'

import { authGuard, createComment, getAllCategories, getAllProducts, getCategoryProducts, getSingleCategory, getSingleProduct, login, signup, updateComment } from "./controllers";

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.get('/products', getAllProducts)
router.get('/products/:id', getSingleProduct)

router.get('/categories', getAllCategories)
router.get('/categories/:id', getSingleCategory)
router.get('/categories/:id/products', getCategoryProducts)

router.post('/comments', authGuard, createComment)
router.patch('/comments/:id', authGuard, updateComment)

export default router