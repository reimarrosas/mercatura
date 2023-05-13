import { Request, Response } from "express"
import { narrowLoginCredentials, narrowSignupCredentials } from "../utils/narrowing"
import { authGuard, isValidEmail, isValidPassword } from "./auth.controller"

describe('Authentication Unit', () => {
    describe('Email Validation', () => {
        it.each([
            [true, 'test@test.com'],
            [false, 'test.com']
        ])('should return %p on email %p', (expected, email) => {
            expect(isValidEmail(email)).toBe(expected)
        })
    })

    describe('Password Validation', () => {
        it.each([
            [true, 'strong password', 'Passw0rd'],
            [true, 'valid password with special characters', 'Passw0rd!@#$%^&*()-_=+[]{}\\|;:\'",<.>/?'],
            [false, 'no uppercase character', 'passw0rd'],
            [false, 'no lowercase character', 'PASSW0RD'],
            [false, 'no numeric character', 'Password'],
            [false, 'less than 8 characters', 'Pw1'],
        ])('should return %p on %s', (expected, _description, password) => {
            expect(isValidPassword(password)).toBe(expected)
        })
    })

    describe('Signup Credentials Narrower', () => {
        const validSignupCredentials = {
            name: 'Reimar Rosas',
            email: 'test@test.com',
            password: 'Passw0rd',
            confirmPassword: 'Passw0rd'
        }

        it.each([
            [true, 'valid signup credentials schema', validSignupCredentials],
            [false, 'invalid name type', { ...validSignupCredentials, name: 1}],
            [false, 'invalid email type', { ...validSignupCredentials, email: null}],
            [false, 'invalid password type', { ...validSignupCredentials, password: undefined}],
            [false, 'invalid confirmPassword type', { ...validSignupCredentials, confirmPassword: false}]
        ])('should return %p on %s', (expected, _description, credentials) => {
            expect(narrowSignupCredentials(credentials)).toBe(expected)
        })
    })

    describe('Login Credentials Narrower', () => {
        const validLoginCredentials = {
            email: 'sample@test.com',
            password: 'Sample-test123'
        }

        it.each([
            [true, 'valid login credentials schema', validLoginCredentials],
            [false, 'invalid email type', { ...validLoginCredentials, email: false }],
            [false, 'invalid password type', { ...validLoginCredentials, password: null }]
        ])('should return %p on %s', (expected, _description, credentials) => {
            expect(narrowLoginCredentials(credentials)).toBe(expected)
        })
    })

    describe('Auth Guard', () => {
        const mockRequest = (): Request => {
            const req: any = {}

            req.session = {}

            return req
        }

        const mockResponse = (): Response => {
            const res: any = {}

            res.status = jest.fn().mockReturnValue(res)
            res.send = jest.fn().mockReturnValue(res)

            return res
        }

        const next = jest.fn()

        it('should run res.status with 401 and body with user not authenticated', () => {
            const req = mockRequest()
            const res = mockResponse()
            authGuard(req, res, next)
            
            expect(res.status).toBeCalledWith(401)
            expect(res.send).toBeCalledWith({
                error: 'User not authenticated'
            })
            expect(next).not.toBeCalled()
        })

        it('should return next called with nothing', () => {
            const req = mockRequest()
            const res = mockResponse()
            req.session.user = {
                id: 1,
                name: 'Sample Name',
                email: 'sample@email.com'
            }
            authGuard(req, res, next)

            expect(res.status).not.toBeCalled()
            expect(res.send).not.toBeCalled()
            expect(next).toBeCalled()
        })
    })
})