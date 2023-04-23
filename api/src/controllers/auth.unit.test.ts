import { narrowSignupCredentials } from "../utils/narrowing"
import { isValidEmail, isValidPassword } from "./auth.controller"

describe('Authentication Unit', () => {
    describe('Email Validation', () => {
        it('should return true on regular email form', () => {
            expect<boolean>(isValidEmail('test@test.com')).toBe(true)
        })

        it('should return false when there\'s no @ symbol', () => {
            expect<boolean>(isValidEmail('test.com')).toBe(false)
        })
    })

    describe('Password Validation', () => {
        it('should return true on strong password', () => {
            expect<boolean>(isValidPassword('Passw0rd')).toBe(true)
        })

        it('should return false on no uppercase character', () => {
            expect<boolean>(isValidPassword('passw0rd')).toBe(false)
        })

        it('should return false on no lowercase character', () => {
            expect<boolean>(isValidPassword('PASSW0RD')).toBe(false)
        })

        it('should return false on no numeric character', () => {
            expect<boolean>(isValidPassword('Password')).toBe(false)
        })

        it('should return false on less than 8 characters', () => {
            expect<boolean>(isValidPassword('Pw1')).toBe(false)
        })
    })

    describe('Signup Credentials Narrower', () => {
        const validSignupCredentials = {
            name: 'Reimar Rosas',
            email: 'test@test.com',
            password: 'Passw0rd',
            confirmPassword: 'Passw0rd'
        }

        it('should return true on valid SignupCredentials Schema', () => {
            expect<boolean>(narrowSignupCredentials(validSignupCredentials)).toBe(true)
        })

        const falseTestCases = [{
            ...validSignupCredentials,
            name: 1
        },{
            ...validSignupCredentials,
            email: null
        },{
            ...validSignupCredentials,
            password: undefined
        },{
            ...validSignupCredentials,
            confirmPassword: false
        }]

        it('should return false on invalid property types', () => {
            falseTestCases.forEach(testCase => expect<boolean>(narrowSignupCredentials(testCase)).toBe(false))
        })
    })
})