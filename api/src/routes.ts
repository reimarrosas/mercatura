import express from 'express'

import { getAllProducts, login, signup } from "./controllers";

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.get('/products', getAllProducts)

export default router