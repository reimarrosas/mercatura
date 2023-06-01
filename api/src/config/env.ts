export interface IConfig {
  port: number
  clientUrl: string
  token: {
    secret: string
  }
}

const config: IConfig = {
  port: parseInt(process.env['PORT'] ?? '8080'),
  clientUrl: process.env['CLIENT_URL'] ?? 'http://localhost:3000',
  token: {
    secret: process.env['SECRET_KEY'] ?? '!!DONT_USE_THIS_SECRET_KEY_ON_PROD!!'
  }
}

export default config
