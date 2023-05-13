import supertest from "supertest"
import { prisma } from "../database"
import { redisClient } from "../utils/config"
import { entityToJson, extractCookieAndUser, truncateDB } from "../utils/testUtils"
import app from "../app"

describe('Comments Integration', () => {
    afterAll(async () => {
        await prisma.$disconnect()

        await redisClient.disconnect()
    })

    describe('POST /comments', () => {
        let authCookie: string,
            userId: number

        beforeEach(async () => {
            await truncateDB()
            ;({ authCookie, userId } = await extractCookieAndUser())
        })

        it('should return 201 on successful comment creation', async () => {
            const product = await prisma.product.create({
                data: {
                    name: 'Towel',
                    description: 'Towel Description',
                    image: 'https://i5.walmartimages.ca/images/Large/756/605/6000201756605.jpg',
                    price: 8.38,
                    quantity: 100,
                }
            })

            const response = await supertest(app).post('/api/v1/comments').set('Cookie', [authCookie]).send({
                content: 'This is a sample comment.',
                productId: product.id
            })

            const comment = await prisma.comment.findFirst({
                where: { content: 'This is a sample comment.', user_id: userId, product_id: product.id }
            })

            expect(response.statusCode).toBe(201)
            expect(response.body).toEqual({
                message: 'Comment creation successful',
                data: comment && entityToJson(comment)
            })
            expect(comment).not.toBeNull()
        })

        it('should return 403 on non-existent product', async () => {
            const response = await supertest(app).post('/api/v1/comments').set('Cookie', [authCookie]).send({
                content: 'This is a sample comment 2.',
                productId: 1000
            })

            const comment = await prisma.comment.findFirst({
                where: {
                    content: "This is a sample comment 2.",
                    user_id: userId,
                    product_id: 1000
                }
            })

            expect(response.statusCode).toBe(403)
            expect(response.body).toEqual({
                error: 'Cannot comment on non-existent product'
            })
            expect(comment).toBeNull()
        })

        it.each([
            [422, 'non-string content', { error: 'Body should contain: content|string, product_id|number' }, { content: null, product_id: 1 }],
            [422, 'non-number product', { error: 'Body should contain: content|string, product_id|number' }, { content: 'Comment', product_id: false }],
            [422, 'falsy data', { error: 'Body should contain: content|string, product_id|number' }, undefined],
        ])('should return %p on %s', async (statusCode, _description, body, comment) => {
            const response = await supertest(app).post('/api/v1/comments').set('Cookie', [authCookie]).send(comment)

            expect(response.statusCode).toBe(statusCode)
            expect(response.body).toEqual(body)
        })

        it('should return 401 on non-authenticated user', async () => {
            const response = await supertest(app).post('/api/v1/comments').send({
                content: 'Sample Comment',
                product: 1
            })

            expect(response.statusCode).toBe(401)
            expect(response.body).toEqual({
                error: 'User not authenticated'
            })
        })
    })

    describe('PATCH /comments', () => {
        let authCookie: string,
            userId: number

        beforeEach(async () => {
            await truncateDB()
            ;({ authCookie, userId } = await extractCookieAndUser())
        })

        it('should return 200 on successful comment update', async () => {
            const product = await prisma.product.create({
                data: {
                    name: 'Towel',
                    description: 'Towel Description',
                    image: 'https://i5.walmartimages.ca/images/Large/756/605/6000201756605.jpg',
                    price: 8.38,
                    quantity: 100,
                    comments: {
                        create: {
                            content: 'Sample Comment on Towel',
                            user_id: userId
                        }
                    }
                },
                include: { comments: true }
            })

            const response = await supertest(app).patch(`/api/v1/comments/${product.comments[0]!.id}`).set('Cookie', [authCookie]).send({
                content: 'Sample Comment on Towel 2',
            })

            const comment = await prisma.comment.findFirst({
                where: { id: product.comments[0]!.id }
            })

            expect(response.statusCode).toBe(200)
            expect(response.body.message).toBe(`Comment ${product.comments[0]!.id} update successful`)
            expect(response.body.data.content). toBe('Sample Comment on Towel 2')
            expect(response.body.data.content).toBe(comment!.content)
        })

        it.each([
            [422, 'non-string content', { error: 'Body should contain: content|string' }, { content: null }],
            [422, 'falsy data', { error: 'Body should contain: content|string' }, undefined],
        ])('should return %p on %s', async (statusCode, _description, body, comment) => {
            const response = await supertest(app).patch('/api/v1/comments/1').set('Cookie', [authCookie]).send(comment)

            expect(response.statusCode).toBe(statusCode)
            expect(response.body).toEqual(body)
        })

        it.each([
            [422, 'character passed as id', 'hello', { error: 'Comment ID must be a non-zero whole number' }],
            [422, 'negative number passed as id', '-1', { error: 'Comment ID must be a non-zero whole number' }],
            [422, 'decimal number passed as id', '1.2', { error: 'Comment ID must be a non-zero whole number' }],
            [403, 'non-existent comment id', '1000', { error: 'Cannot update comment 1000' }],
        ])('should return %i on %s', async (statusCode, _description, passedId, body) => {
            const response = await supertest(app).patch(`/api/v1/comments/${passedId}`).set('Cookie', [authCookie]).send({
                content: 'Sample Comment'
            })

            expect(response.statusCode).toBe(statusCode)
            expect(response.body).toEqual(body)
        })

        it('should return 401 on non-authenticated user', async () => {
            const response = await supertest(app).patch('/api/v1/comments/1').send({
                content: 'Sample Comment',
            })

            expect(response.statusCode).toBe(401)
            expect(response.body).toEqual({
                error: 'User not authenticated'
            })
        })
    })

    describe('DELETE /comments', () => {
        let authCookie: string,
            userId: number

        beforeEach(async () => {
            await truncateDB()
            ;({ authCookie, userId } = await extractCookieAndUser())
        })

        it('should return 200 on successful comment delete', async () => {
            const product = await prisma.product.create({
                data: {
                    name: 'Towel',
                    description: 'Towel Description',
                    image: 'https://i5.walmartimages.ca/images/Large/756/605/6000201756605.jpg',
                    price: 8.38,
                    quantity: 100,
                    comments: {
                        create: {
                            content: 'Sample Comment on Towel',
                            user_id: userId
                        }
                    }
                },
                include: { comments: true }
            })

            const response = await supertest(app).delete(`/api/v1/comments/${product.comments[0]!.id}`).set('Cookie', [authCookie]).send()

            const comment = await prisma.comment.findFirst({
                where: { id: product.comments[0]!.id }
            })

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({
                message: `Comment ${product.comments[0]!.id} deletion successful`,
                data: entityToJson(product.comments[0]!)
            })
            expect(comment).toBeNull()
        })

        it.each([
            [422, 'character passed as id', 'hello', { error: 'Comment ID must be a non-zero whole number' }],
            [422, 'negative number passed as id', '-1', { error: 'Comment ID must be a non-zero whole number' }],
            [422, 'decimal number passed as id', '1.2', { error: 'Comment ID must be a non-zero whole number' }],
            [403, 'non-existent comment id', '1000', { error: 'Cannot delete comment 1000' }],
        ])('should return %i on %s', async (statusCode, _description, passedId, body) => {
            const response = await supertest(app).delete(`/api/v1/comments/${passedId}`).set('Cookie', [authCookie]).send()

            expect(response.statusCode).toBe(statusCode)
            expect(response.body).toEqual(body)
        })

        it('should return 401 on non-authenticated user', async () => {
            const response = await supertest(app).delete('/api/v1/comments/1').send({
                content: 'Sample Comment',
            })

            expect(response.statusCode).toBe(401)
            expect(response.body).toEqual({
                error: 'User not authenticated'
            })
        })
    })
})