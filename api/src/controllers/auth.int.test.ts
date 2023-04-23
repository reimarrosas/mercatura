import { faker } from '@faker-js/faker'

import { SignupCredentials } from "../../types"
import supertest from 'supertest';
import app from '../app';
import { prisma } from '../database';
import { redisClient } from '../utils/config';

type Response = {
    message?: string;
    error?: string;
}

describe('Authentication Integration', () => {
    const initialUser = {
        name: 'Sample User',
        email: 'sample@test.com',
        password: '$argon2id$v=19$m=16,t=3,p=1$aFo2ZkdIUEVyd0x1UW5lTA$y7ojp7qh6Sa2Iv2lKsErwDjJkmwuexT2EWMiPg5Yu8Y'
    }

    const generatePassword = () => 'Aa1' + faker.internet.password(8)

    beforeAll(async () => {
        await prisma.user.create({
            data: initialUser
        })
    })

    afterAll(async () => {
        const deleteUsers = prisma.user.deleteMany()

        await prisma.$transaction([deleteUsers])

        await prisma.$disconnect()

        await redisClient.disconnect()
    })

    describe('Signup', () => {
        it('should return 201 on valid signup credentials', async () => {
            const password = generatePassword()
            const signupCreds: SignupCredentials = {
                name: faker.name.fullName(),
                email: faker.internet.email(),
                password,
                confirmPassword: password
            }

            const response = await supertest(app).post('/api/v1/signup').send(signupCreds)

            expect<number>(response.statusCode).toBe(201)
            expect<Response>(response.body).toEqual({
                message: 'User signup successful',
                error: null
            })

            const insertedUser = await prisma.user.findFirst({
                where: { email: signupCreds.email }
            })

            expect(insertedUser).not.toBeNull()
            expect(insertedUser?.name).toBe(signupCreds.name)
            expect(insertedUser?.password).not.toBe(signupCreds.password)
            expect(insertedUser?.password.startsWith('$argon2id')).toBe(true)
        })

        it('should return 422 on wrong POST body schema', async () => {
            const response = await supertest(app).post('/api/v1/signup').send({})

            expect<number>(response.statusCode).toBe(422)
            expect<Response>(response.body).toEqual({
                message: null,
                error: 'Body should contain: name|string, email|string, password|string, confirmPassword|string'
            })
        })

        it('should return 422 on different password', async () => {
            const signupCreds: SignupCredentials = {
                name: faker.name.fullName(),
                email: faker.internet.email(),
                password: generatePassword(),
                confirmPassword: generatePassword()
            }

            const response = await supertest(app).post('/api/v1/signup').send(signupCreds)

            expect<number>(response.statusCode).toBe(422)
            expect<Response>(response.body).toEqual({
                message: null,
                error: 'Password does not match'
            })
        })

        it('should return 422 on invalid email pattern', async () => {
            const password = generatePassword()
            const signupCreds: SignupCredentials = {
                name: faker.name.fullName(),
                email: faker.name.fullName(),
                password,
                confirmPassword: password
            }

            const response = await supertest(app).post('/api/v1/signup').send(signupCreds)

            expect<number>(response.statusCode).toBe(422)
            expect<Response>(response.body).toEqual({
                message: null,
                error: 'Invalid email'
            })
        })

        it('should return 422 on invalid password pattern', async () => {
            const password = faker.lorem.word(4)
            const signupCreds: SignupCredentials = {
                name: faker.name.fullName(),
                email: faker.internet.email(),
                password: 'Pw1',
                confirmPassword: password
            }

            const response = await supertest(app).post('/api/v1/signup').send(signupCreds)

            expect<number>(response.statusCode).toBe(422)
            expect<Response>(response.body).toEqual({
                message: null,
                error: 'Invalid password'
            })
        })

        it('should return 403 on already existing email', async () => {
            const signupCreds: SignupCredentials = {
                name: 'Sample User',
                email: 'sample@test.com',
                password: 'Sample-test123',
                confirmPassword: 'Sample-test123'
            }

            const response = await supertest(app).post('/api/v1/signup').send(signupCreds)

            expect<number>(response.statusCode).toBe(403)
            expect<Response>(response.body).toEqual({
                message: null,
                error: 'User already exists'
            })
        })

    })

    describe('Login', () => {
        it('should return 200 on valid login credentials', async () => {
            const loginCreds = {
                email: 'sample@test.com',
                password: 'Sample-test123'
            }

            const response = await supertest(app).post('/api/v1/login').send(loginCreds)

            expect(response.statusCode).toBe(200)
            expect(response.headers['set-cookie']).not.toBeFalsy()
            expect(response.body).toEqual({
                message: 'User login successful',
                error: null
            })
        })

        it('should return 403 if user does not exist', async () => {
            const loginCreds = {
                email: 'sample-ne@test.com',
                password: 'Sample-test123'
            }

            const response = await supertest(app).post('/api/v1/login').send(loginCreds)

            expect(response.statusCode).toBe(403)
            expect(response.headers['set-cookie']).toBeFalsy()
            expect(response.body).toEqual({
                message: null,
                error: 'User does not exist'
            })
        })

        it('should return 401 if password provided does not match', async () => {
            const loginCreds = {
                email: 'sample@test.com',
                password: 'WrongPassw0rd'
            }

            const response = await supertest(app).post('/api/v1/login').send(loginCreds)

            expect(response.statusCode).toBe(401)
            expect(response.headers['set-cookie']).toBeFalsy()
            expect(response.body).toEqual({
                message: null,
                error: 'Invalid password'
            })
        })

        it('should return 422 on wrong POST body schema', async () => {
            const loginCreds = {
                email: undefined,
                password: null
            }

            const response = await supertest(app).post('/api/v1/login').send(loginCreds)

            expect(response.statusCode).toBe(422)
            expect(response.headers['set-cookie']).toBeFalsy()
            expect(response.body).toEqual({
                message: null,
                error: 'Body should contain: email|string, password|string'
            })
        })

        it('should return 422 on invalid email pattern', async () => {
            const loginCreds = {
                email: 'test.com',
                password: 'Sample-test123'
            }

            const response = await supertest(app).post('/api/v1/login').send(loginCreds)

            expect<number>(response.statusCode).toBe(422)
            expect<Response>(response.body).toEqual({
                message: null,
                error: 'Invalid email'
            })
        })

        it('should return 422 on invalid password pattern', async () => {
            const loginCreds = {
                email: 'sample@test.com',
                password: 'Pw1'
            }

            const response = await supertest(app).post('/api/v1/login').send(loginCreds)

            expect<number>(response.statusCode).toBe(422)
            expect<Response>(response.body).toEqual({
                message: null,
                error: 'Invalid password'
            })
        })
    })
})