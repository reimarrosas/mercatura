import { isIDValid } from "./isIDValid"

describe('isIDValid Unit', () => {
    describe('ID Validation', () => {
        it.each([
            [true, 'non-zero whole number', '10'],
            [false, 'zero-starting numbers', '010'],
            [false, 'characters', 'hello'],
            [false, 'characters', 'hello'],
            [false, 'negative numbers', '-10'],
            [false, 'decimal numbers', '1.234'],
            [false, 'undefined', undefined],
        ])('should return %p on %s', (expected, _description, input) => {
            expect(isIDValid(input)).toBe(expected)
        })
    })
})