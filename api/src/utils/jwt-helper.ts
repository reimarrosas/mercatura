import { AuthData, IJwtHelper } from '@type/auth'
import { IConfig } from '@type/config'
import jwt from 'jsonwebtoken'

export class JwtHelper implements IJwtHelper {
  constructor(private readonly config: IConfig) {}

  extractPayload(token: string) {
    try {
      return jwt.verify(token, this.config.token.secret) as AuthData
    } catch (e) {
      return undefined
    }
  }
}
