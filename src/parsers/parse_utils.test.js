import { parse_attrs, tokenize } from './parse_utils'

describe('parse attributes', () => {
    test('return empty', () => {
        expect(parse_attrs('     ')).toEqual({})
    })

    test('only attribute keys', () => {
        const inp = '   a  b         c d         '
        const out = { a: true, b: true, c: true, d: true }
        expect(parse_attrs(inp)).toEqual(out)
    })

    test('mixed delimiters', () => {
        const inp = '   a=a  b="b"         c d="d\\"d"'
        const out = { a: 'a', b: 'b', c: true, d: 'd"d' }
        expect(parse_attrs(inp)).toEqual(out)
    })

    test('for tokenized input', () => {
        const inp = tokenize('   a=a  b="b"         c d="d\\"d"')
        const out = { a: 'a', b: 'b', c: true, d: 'd"d' }
        expect(parse_attrs(inp)).toEqual(out)
    })
})

describe('tokenizer', () => {
    test('keeps normal character', () => {
        const inp = 'abcde'
        const out = Array.from(inp).map(x => [x, x])

        expect(tokenize(inp)).toEqual(out)
    })

    test('characters that should not be escaped', () => {
        const inp = '\\a\\b\\c\\1\\2\\3\\~'
        const out = Array.from(inp).map(x => [x, x])

        expect(tokenize(inp)).toEqual(out)
    })

    test('escapes special characters', () => {
        const inp = '\\+\\-\\*\\_\\[\\]\\/\\\\'

        const out = [
            ['\\', '+'],
            ['\\', '-'],
            ['\\', '*'],
            ['\\', '_'],
            ['\\', '['],
            ['\\', ']'],
            ['\\', '/'],
            ['\\', '\\'],
        ]

        expect(tokenize(inp)).toEqual(out)
    })
})
