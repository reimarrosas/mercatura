import { IAuthService } from '@domain/auth/service'
import { RequestHandler } from 'express'
import { ILogger } from '@config/logger'
import { loginDto, signupDto } from '@domain/auth/dto'
import { AppError, HTTPStatusCodes } from '@shared/app-error'
import { IJwtUtils } from '@/domain/auth/utils/jwt'

export const authHandlerFactory = (
  logger: ILogger,
  authService: IAuthService,
  jwtUtils: IJwtUtils
) => {
  const signup: RequestHandler = async (req, res) => {
    const result = signupDto.safeParse(req.body)

    if (!result.success) {
      logger.error(result.error)
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

  const login: RequestHandler = async (req, res) => {
    const result = loginDto.safeParse(req.body)

    if (!result.success) {
      logger.error(result.error)
      throw new AppError(
        HTTPStatusCodes.UNPROCESSABLE_ENTITY,
        'Invalid request body schema'
      )
    }

    const authData = await authService.loginUser(result.data)

    if (!authData) {
      throw new AppError(HTTPStatusCodes.FORBIDDEN, 'Action Forbidden')
    }

    const token = jwtUtils.createToken(authData)

    return res.send({
      message: 'User login successful',
      token
    })
  }

  return {
    signup,
    login
  }
}
