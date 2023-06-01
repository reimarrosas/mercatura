import express from 'express'
import { authHandlerFactory } from '@/domain/auth/auth.handler'
import logger from '@config/logger'
import { authServiceFactory } from '@/domain/auth/auth.service'
import db from '@config/db'
import { jwtUtilsFactory } from '@/domain/auth/utils/jwt'
import config from '@config/env'
import { guest } from '@/domain/auth/middleware/guest'

const router = express.Router()

const authService = authServiceFactory(db)
const jwtUtils = jwtUtilsFactory(config)
const { login, signup } = authHandlerFactory(logger, authService, jwtUtils)

router.use(guest)
router.post('/login', login)
router.post('/signup', signup)

export default router
