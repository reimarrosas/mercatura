import { IAuthService } from '@/domain/auth/auth.service'
import { RequestHandler } from 'express'
import { HandlerFactoryReturnType } from '@shared/types/handler-factory'
import { ILogger } from '@config/logger'
import { signupDto } from '@/domain/auth/auth-dto'
import { AppError, HTTPStatusCodes } from '@shared/app-error'

export const authHandlerFactory = (
  logger: ILogger,
  authService: IAuthService
): HandlerFactoryReturnType => {
  const signup: RequestHandler = async (req, res) => {
    const result = signupDto.safeParse(req.body)

    if (!result.success) {
      throw new AppError(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY,
        'Invalid request body schema'
      )
    }

    try {
      await authService.createUser(result.data)
    } catch (err) {
      logger.error(err)
      throw new AppError(HTTPStatusCodes.FORBIDDEN, 'Action Forbidden')
    }

    return res.status(201).send({
      message: 'User creation successful'
    })
  }

  const login: RequestHandler = () => {}

  return {
    signup,
    login
  }
}
