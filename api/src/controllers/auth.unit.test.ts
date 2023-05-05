import { narrowLoginCredentials, narrowSignupCredentials } from "../utils/narrowing"
import { isValidEmail, isValidPassword } from "./auth.controller"

describe('Authentication Unit', () => {
    describe('Email Validation', () => {
        it('should return true on regular email form', () => {
            expect(isValidEmail('test@test.com')).toBe(true)
        })

        it('should return false when there\'s no @ symbol', () => {
            expect(isValidEmail('test.com')).toBe(false)
        })
    })

    describe('Password Validation', () => {
        it('should return true on strong password', () => {
            expect(isValidPassword('Passw0rd')).toBe(true)
        })

        it('should return true on valid password with special characters', () => {
            expect(isValidPassword('Passw0rd!@#$%^&*()-_=+[]{}\\|;:\'",<.>/?'))
        })

        it('should return false on no uppercase character', () => {
            expect(isValidPassword('passw0rd')).toBe(false)
        })

        it('should return false on no lowercase character', () => {
            expect(isValidPassword('PASSW0RD')).toBe(false)
        })

        it('should return false on no numeric character', () => {
            expect(isValidPassword('Password')).toBe(false)
        })

        it('should return false on less than 8 characters', () => {
            expect(isValidPassword('Pw1')).toBe(false)
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
            expect(narrowSignupCredentials(validSignupCredentials)).toBe(true)
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

    describe('Login Credentials Narrower', () => {
        const validLoginCredentials = {
            email: 'sample@test.com',
            password: 'Sample-test123'
        }

        it('should return true on valid LoginCredentials Schema', () => {
            expect(narrowLoginCredentials(validLoginCredentials)).toBe(true)
        })

        const falseTestCases = [{
            ...validLoginCredentials,
            email: false
        }, {
            ...validLoginCredentials,
            password: null
        }]

        it('should return false on invalid property types', () => {
            falseTestCases.forEach(testCase => expect(narrowLoginCredentials(testCase)).toBe(false))
        })
    })
})