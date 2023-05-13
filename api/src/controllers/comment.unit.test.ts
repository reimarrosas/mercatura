import { narrowCommentSchema } from "../utils/narrowing"

describe('Comment Unit', () => {
    describe('Comment Creation Data Narrower', () => {
        it.each([
            [true, 'valid data', { content: 'Comment', productId: 1 }],
            [false, 'non-string content', { content: null, productId: 1 }],
            [false, 'non-number product', { content: 'Comment', productId: false }],
            [false, 'falsy data', undefined],
        ])('should return %p on %s', (expected, _description, comment) => {
            expect(narrowCommentSchema(comment)).toBe(expected)
        })
    })
})