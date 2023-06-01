import { AuthData } from '@type/auth'

declare global {
  namespace Express {
    export interface Request {
      auth?: AuthData
    }
  }
}
