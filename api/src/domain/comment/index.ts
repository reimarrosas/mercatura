import express from 'express'
import { commentHandlerFactory } from '@domain/comment/handler'
import logger from '@config/logger'
import { commentServiceFactory } from '@domain/comment/service'
import db from '@config/db'
import { authenticated } from '@domain/auth/middleware/authenticated'

const router = express.Router()

router.use(authenticated)

const commentService = commentServiceFactory(db)
const commentHandler = commentHandlerFactory(logger, commentService)
router.post('/', commentHandler.createComment)
router.put('/:id', commentHandler.updateComment)
router.delete('/:id', commentHandler.deleteComment)

export default router
