import jwt from 'jsonwebtoken'

import { IConfig } from '@config/env'
import { authData, IAuthData } from '@shared/validators/auth-data'

export interface IJwtUtils {
  extractPayload: (token: string) => IAuthData | undefined
  createToken: (payload: IAuthData) => string
}

export const jwtUtilsFactory = ({ token: tokenCfg }: IConfig): IJwtUtils => {
  const extractPayload = (token: string): IAuthData | undefined => {
    try {
      const payload = jwt.verify(token, tokenCfg.secret)

      const result = authData.safeParse(payload)

      if (result.success) {
        return result.data
      }

      return undefined
    } catch (_) {
      return undefined
    }
  }
  const createToken = (payload: IAuthData) =>
    jwt.sign(payload, tokenCfg.secret, tokenCfg.options)

  return {
    extractPayload,
    createToken
  }
}
