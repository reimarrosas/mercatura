import { SignupCredentials } from "../../types"

export const hasKey = <K extends PropertyKey>(key: K, obj: object): obj is Record<K, unknown> => key in obj

export const narrowSignupCredentials = (creds: unknown): creds is SignupCredentials =>
    typeof creds === 'object' && creds != null &&
    hasKey('name', creds) && typeof creds.name === 'string' &&
    hasKey('email', creds) && typeof creds.email === 'string' &&
    hasKey('password', creds) && typeof creds.password === 'string' &&
    hasKey('confirmPassword', creds) && typeof creds.confirmPassword === 'string'