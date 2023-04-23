import { redisClient } from "./config"

beforeAll(() => {})

afterAll((done) => {
    redisClient.disconnect().then(() => done())
})