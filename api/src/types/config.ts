interface ITokenConfig {
  secret: string
  algorithm: 'HS256' | 'HS384' | 'HS512'
  audience: string
  issuer: string
  subject: string
}

export interface IConfig {
  clientUrl: string
  apiUrl: string
  port: string
  token: ITokenConfig
}
