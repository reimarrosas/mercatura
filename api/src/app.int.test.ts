import supertest from "supertest"

import app from "./app"
import { redisClient } from "./utils/config";

describe('GET /', () => {
    it('should return a 200 with a message: `Hello, World!`', async () => {
        const response = await supertest(app).get('/')

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            message: 'Hello, World!'
        })
    })

    afterAll(async () => await redisClient.disconnect())
})