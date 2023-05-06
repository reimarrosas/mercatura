import express from 'express'

import { getAllProducts, getSingleProduct, login, signup } from "./controllers";

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.get('/products', getAllProducts)
router.get('/products/:id', getSingleProduct)

export default router