import { SignOptions } from 'jsonwebtoken'

export interface IConfig {
  port: number
  clientUrl: string
  token: {
    secret: string
    options: SignOptions
  }
}

const clientUrl = process.env['CLIENT_URL'] ?? 'http://localhost:3000'

const config: IConfig = {
  port: parseInt(process.env['PORT'] ?? '8080'),
  clientUrl,
  token: {
    secret: process.env['SECRET_KEY'] ?? '!!DONT_USE_THIS_SECRET_KEY_ON_PROD!!',
    options: {
      algorithm: 'HS512',
      audience: clientUrl,
      issuer: process.env['API'] ?? 'http://localhost:8080',
      subject: clientUrl
    }
  }
}

export default config
