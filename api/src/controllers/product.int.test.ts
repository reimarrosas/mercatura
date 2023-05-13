import supertest from "supertest"

import { prisma } from "../database"
import { redisClient } from "../utils/config"
import app from "../app"
import { entityToJson, extractCookieAndUser, truncateDB } from "../utils/testUtils"

describe('Product Integration', () => {
    afterAll(async () => {
        await prisma.$disconnect()

        await redisClient.disconnect()
    })

    describe('GET /products', () => {

        beforeEach(async () => await truncateDB())

        it('should return 200 on get request on /products', async () => {
            await prisma.product.createMany({
                data: [
                    {
                        name: 'Towel',
                        description: 'Towel Description',
                        image: 'https://i5.walmartimages.ca/images/Large/756/605/6000201756605.jpg',
                        price: 8.38,
                        quantity: 100,
                    },
                    {
                        name: 'Bag',
                        description: 'Bag Description',
                        image: 'https://i5.walmartimages.ca/images/Large/027/733/6000200027733.jpg',
                        price : 24.97,
                        quantity: 1,
                    }
                ]
            })

            const products = await prisma.product.findMany()

            const response = await supertest(app).get('/api/v1/products')

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({
                message: 'GET Products successful',
                data: products.map(entityToJson)
            })
        })
    })

    describe('GET /products/:id', () => {

        beforeEach(async () => await truncateDB())

        it('should return 200 on existing product', async () => {
            const product = await prisma.product.create({
                data: {
                    name: 'Towel',
                    description: 'Towel Description',
                    image: 'https://i5.walmartimages.ca/images/Large/756/605/6000201756605.jpg',
                    price: 8.38,
                    quantity: 100,
                },
                include: { comments: true }
            })

            const response = await supertest(app).get(`/api/v1/products/${product.id}`)

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({
                message: `GET Product ${product.id} successful`,
                data: product && entityToJson(product)
            })
        })

        it('should return 200 on product with comments', async () => {
            const { userId } = await extractCookieAndUser()
            const product = await prisma.product.create({
                data: {
                    name: 'Towel',
                    description: 'Towel Description',
                    image: 'https://i5.walmartimages.ca/images/Large/756/605/6000201756605.jpg',
                    price: 8.38,
                    quantity: 100,
                    comments: {
                        createMany: {
                            data: [
                                {
                                    content: 'Sample Comment 1',
                                    user_id: userId
                                },
                                {
                                    content: 'Sample Comment 2',
                                    user_id: userId
                                },
                                {
                                    content: 'Sample Comment 3',
                                    user_id: userId
                                }
                            ]
                        }
                    }
                },
                include: { comments: true }
            })

            const response = await supertest(app).get(`/api/v1/products/${product.id}`)

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({
                message: `GET Product ${product.id} successful`,
                data: entityToJson(product)
            })
        })

        it.each([
            [422, 'character passed as id', 'hello', { error: 'Product ID must be a non-zero whole number' }],
            [422, 'negative number passed as id', '-1', { error: 'Product ID must be a non-zero whole number' }],
            [422, 'decimal number passed as id', '1.2', { error: 'Product ID must be a non-zero whole number' }],
            [404, 'non-existent product id', '1000', { error: 'Product 1000 not found' }],
        ])('should return %i on %s', async (statusCode, _description, passedId, body) => {
            const response = await supertest(app).get(`/api/v1/products/${passedId}`)

            expect(response.statusCode).toBe(statusCode)
            expect(response.body).toEqual(body)
        })
    })
})