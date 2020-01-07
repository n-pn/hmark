const utils = require('./parse_utils')

describe('parse attributes', () => {
    test('return empty', () => {
        expect(utils.parse_attrs('     ')).toEqual({})
    })

    test('only attribute keys', () => {
        const inp = '   a  b         c d         '
        const out = { a: true, b: true, c: true, d: true }
        expect(utils.parse_attrs(inp)).toEqual(out)
    })

    test('mixed delimiters', () => {
        const inp = '   a=a  b="b"         c d="d\\"d"'
        const out = { a: 'a', b: 'b', c: true, d: 'd"d' }
        expect(utils.parse_attrs(inp)).toEqual(out)
    })

    test('for tokenized input', () => {
        const inp = utils.tokenize('   a=a  b="b"         c d="d\\"d"')
        const out = { a: 'a', b: 'b', c: true, d: 'd"d' }
        expect(utils.parse_attrs(inp)).toEqual(out)
    })
})

describe('tokenizer', () => {
    test('keeps normal character', () => {
        const inp = 'abcde'
        const out = Array.from(inp).map(x => [x, x])

        expect(utils.tokenize(inp)).toEqual(out)
    })

    test('characters that should not be escaped', () => {
        const inp = '\\a\\b\\c\\1\\2\\3\\~'
        const out = Array.from(inp).map(x => [x, x])

        expect(utils.tokenize(inp)).toEqual(out)
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

        expect(utils.tokenize(inp)).toEqual(out)
    })
})
