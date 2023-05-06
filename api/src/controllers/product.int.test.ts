import supertest from "supertest"
import { prisma } from "../database"
import { redisClient } from "../utils/config"
import app from "../app"

describe('Product Integration', () => {
    beforeAll(async () => {
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
                },
                {
                    name: 'Battery',
                    description: 'Battery Description',
                    image: 'https://i5.walmartimages.ca/images/Large/174/852/6000201174852.jpg',
                    price: 13.98,
                    quantity: 50
                }
            ]
        })
    })

    afterAll(async () => {
        const deleteProducts = prisma.product.deleteMany()

        await prisma.$transaction([deleteProducts])

        await prisma.$disconnect()

        await redisClient.disconnect()
    })

    describe('GET /products', () => {
        it('should return 200 on get request on /products', async () => {
            const response = await supertest(app).get('/api/v1/products')

            const products = await prisma.product.findMany()

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({
                message: 'GET Products successful',
                data: products.map(product => ({
                    ...product,
                    price: product.price.toString(),
                    created_at: product.created_at.toISOString(),
                    updated_at: product.updated_at.toISOString()
                }))
            })
        })
    })
})