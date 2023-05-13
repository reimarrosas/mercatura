import supertest from "supertest"
import { prisma } from "../database"
import { redisClient } from "../utils/config"
import app from "../app"
import { entityToJson, truncateDB } from "../utils/testUtils"

describe('Category Integration', () => {
    afterAll(async () => {
        await prisma.$disconnect()

        await redisClient.disconnect()
    })

    describe('GET /categories', () => {

        beforeEach(async () => await truncateDB())

        it('should return 200 on get request on /categories', async () => {
            await prisma.category.createMany({
                data: [
                    {
                        name: 'Category 1',
                        description: 'Category 1 Description',
                        image: 'https://www.dnr.sc.gov/climate/sco/hurricanes/images/c1.png',
                    },
                    {
                        name: 'Category 2',
                        description: 'Category 2 Description',
                        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Saffir-Simpson_Category_2.svg/200px-Saffir-Simpson_Category_2.svg.png?20070204194955'
                    }
                ]
            })

            const categories = await prisma.category.findMany()

            const response = await supertest(app).get('/api/v1/categories')

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({
                message: 'GET Categories successful',
                data: categories.map(entityToJson)
            })
        })
    })

    describe('GET /categories/:id', () => {

        beforeEach(async () => await truncateDB())

        it('should return 200 on existing product', async () => {
            const category = await prisma.category.create({
                data: {
                    name: 'Category Latest',
                    description: 'Category Latest Description',
                    image: 'https://www.dnr.sc.gov/climate/sco/hurricanes/images/c1.png',
                }
            })

            const response = await supertest(app).get(`/api/v1/categories/${category.id}`)

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({
                message: `GET Product ${category.id} successful`,
                data: category && entityToJson(category)
            })
        })

        it.each([
            [422, 'character passed as id', 'hello', { error: 'Category ID must be a non-zero whole number' }],
            [422, 'negative number passed as id', '-1', { error: 'Category ID must be a non-zero whole number' }],
            [422, 'decimal number passed as id', '1.2', { error: 'Category ID must be a non-zero whole number' }],
            [404, 'non-existent category id', '1000', { error: 'Category 1000 not found' }],
        ])('should return %i on %s', async (statusCode, _description, passedId, body) => {
            const response = await supertest(app).get(`/api/v1/categories/${passedId}`)

            expect(response.statusCode).toBe(statusCode)
            expect(response.body).toEqual(body)
        })
    })

    describe('GET /categories/:id/products', () => {

        beforeEach(async () => await truncateDB())

        it('should return 200 on successful fetch product by category', async () => {
            const category = await prisma.category.create({
                data: {
                    name: 'Category Latest',
                    description: 'Category Latest Description',
                    image: 'https://www.dnr.sc.gov/climate/sco/hurricanes/images/c1.png',
                    products: {
                        createMany: {
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
                                    price: 24.97,
                                    quantity: 1,
                                }
                            ]
                        }
                    }
                },
                include: {
                    products: true
                }
            })

            const response = await supertest(app).get(`/api/v1/categories/${category.id}/products`)

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({
                message: `GET Products with Category ${category.id} successful`,
                data: category.products.map(entityToJson)
            })
        })

        it.each([
            [422, 'character passed as id', 'hello', { error: 'Category ID must be a non-zero whole number' }],
            [422, 'negative number passed as id', '-1', { error: 'Category ID must be a non-zero whole number' }],
            [422, 'decimal number passed as id', '1.2', { error: 'Category ID must be a non-zero whole number' }],
            [404, 'non-existent category id', '1000', { error: 'Category 1000 not found' }],
        ])('should return %i on %s', async (statusCode, _description, passedId, body) => {
            const response = await supertest(app).get(`/api/v1/categories/${passedId}/products`)

            expect(response.statusCode).toBe(statusCode)
            expect(response.body).toEqual(body)
        })
    })
})