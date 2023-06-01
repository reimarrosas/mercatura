import { IAuthData } from '@shared/validators/auth-data'

declare global {
  namespace Express {
    export interface Request {
      auth?: IAuthData
    }
  }
}
