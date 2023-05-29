export interface AuthData {
  id: string
  name: string
  email: string
}

export interface IJwtHelper {
  extractPayload: (token: string) => AuthData | undefined
}
