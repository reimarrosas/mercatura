import { faker } from '@faker-js/faker'

import supertest from 'supertest';
import app from '../app';
import { prisma } from '../database';
import { redisClient } from '../utils/config';

describe('Authentication Integration', () => {
    const initialUser = {
        name: 'Sample User',
        email: 'sample@test.com',
        password: '$argon2id$v=19$m=16,t=3,p=1$aFo2ZkdIUEVyd0x1UW5lTA$y7ojp7qh6Sa2Iv2lKsErwDjJkmwuexT2EWMiPg5Yu8Y'
    }

    const generateSinglePassword = () => 'Aa1' + faker.internet.password(8)

    const generateBothPasswords = () => {
        const pw = generateSinglePassword()
        return {
            password: pw,
            confirmPassword: pw
        }
    }

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
        const validSignupCredentials = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            ...(generateBothPasswords())
        }

        it('should return 201 on valid signup credentials', async () => {
            const response = await supertest(app).post('/api/v1/signup').send(validSignupCredentials)

            expect(response.statusCode).toBe(201)
            expect(response.body).toEqual({
                message: 'User signup successful',
            })

            const insertedUser = await prisma.user.findFirst({
                where: { email: validSignupCredentials.email }
            })

            expect(insertedUser).not.toBeNull()
            expect(insertedUser?.name).toBe(validSignupCredentials.name)
            expect(insertedUser?.password).not.toBe(validSignupCredentials.password)
            expect(insertedUser?.password.startsWith('$argon2id')).toBe(true)
        })

        it.each([
            [422, 'wrong POST body schema', { error: 'Body should contain: name|string, email|string, password|string, confirmPassword|string' }, {}],
            [422, 'different passwords', { error: 'Password does not match' }, { ...validSignupCredentials, confirmPassword: generateSinglePassword()}],
            [422, 'invalid email pattern', { error: 'Invalid email' }, { ...validSignupCredentials, email: 'test.com' }],
            [422, 'invalid password pattern', { error: 'Invalid password' }, { ...validSignupCredentials, password: 'Pw1', confirmPassword: 'Pw1' }],
            [403, 'already existing email', { error: 'User already exists' }, { ...validSignupCredentials, email: 'sample@test.com' }]
        ])('should return status %i on %s', async (statusCode, _description, body, credentials) => {
            const response = await supertest(app).post('/api/v1/signup').send(credentials)

            expect(response.statusCode).toBe(statusCode)
            expect(response.body).toEqual(body)
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
            })
        })

        it.each([
            [403, 'user not existing', { error: 'User does not exist' }, { email: 'sample-ne@test.com', password: 'Sample-test123' }],
            [401, 'password provided not matching', { error: 'Invalid password' }, { email: 'sample@test.com', password: 'WrongPassw0rd' }],
            [422, 'wrong POST body schema', { error: 'Body should contain: email|string, password|string' }, { email: undefined, password: null }],
            [422, 'invalid email pattern', { error: 'Invalid email' }, { email: 'test.com', password: 'Sample-test123' }],
            [422, 'invalid password pattern', { error: 'Invalid password' }, { email: 'sample@test.com', password: 'Pw1' }]
        ])('should return %i on %s', async (statusCode, _description, body, credentials) => {
            const response = await supertest(app).post('/api/v1/login').send(credentials)

            expect(response.statusCode).toBe(statusCode)
            expect(response.headers['set-cookie']).toBeFalsy()
            expect(response.body).toEqual(body)
        })
    })
})