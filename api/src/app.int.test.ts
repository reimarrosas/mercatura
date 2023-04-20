import supertest from "supertest"

import app from "./app"

type GetSlashResponse = {
    message: string;
}

describe('GET /', () => {
    it('should return a 200 with a message: `Hello, World!`', async () => {
        const response = await supertest(app).get('/')

        expect<number>(response.statusCode).toBe(200)
        expect<GetSlashResponse>(response.body).toEqual({
            message: 'Hello, World!'
        })
    })
})