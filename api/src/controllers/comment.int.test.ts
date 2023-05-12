import supertest from "supertest"
import { prisma } from "../database"
import { redisClient } from "../utils/config"
import { commentsToJson, extractCookieAndUser, truncateDB } from "../utils/testUtils"
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
                data: comment && commentsToJson(comment)
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
    })
})