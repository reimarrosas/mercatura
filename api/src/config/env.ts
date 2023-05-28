import { IConfig } from '@type/config'

const port = process.env['PORT'] ?? '8080'
const apiUrl = process.env['API_URL'] ?? `http://localhost:${port}`
const clientUrl = process.env['CLIENT_URL'] ?? 'http://localhost:3000'

const Config: IConfig = {
  clientUrl,
  apiUrl,
  port,
  token: {
    secret: process.env['TOKEN_SECRET'] ?? 'Sample Secret',
    algorithm: 'HS512',
    audience: apiUrl,
    issuer: apiUrl,
    subject: clientUrl
  }
}

export default Config
