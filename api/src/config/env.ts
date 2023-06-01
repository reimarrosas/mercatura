import { IConfig } from '@type/config'

const port = parseInt(process.env['PORT'] ?? '8080')
const clientUrl = process.env['CLIENT_URL'] ?? 'http://localhost:3000'

const config: IConfig = {
  port,
  clientUrl
}

export default config
