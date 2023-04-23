import { LoginCredentials, SignupCredentials } from "../../types"

export const hasKey = <K extends PropertyKey>(key: K, obj: object): obj is Record<K, unknown> => key in obj

export const narrowSignupCredentials = (creds: unknown): creds is SignupCredentials =>
    narrowLoginCredentials(creds) &&
    hasKey('name', creds) && typeof creds.name === 'string' &&
    hasKey('confirmPassword', creds) && typeof creds.confirmPassword === 'string'

export const narrowLoginCredentials = (creds: unknown): creds is LoginCredentials =>
    typeof creds === 'object' && creds != null &&
    hasKey('email', creds) && typeof creds.email === 'string' &&
    hasKey('password', creds) && typeof creds.password === 'string'