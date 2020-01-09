import scan_attrs from './scan_attrs'

describe('parse attributes', () => {
    test('return empty', () => {
        expect(scan_attrs('     ')).toEqual({})
    })

    test('only attribute keys', () => {
        const inp = '   a  b         c d         '
        const out = { a: 'a', b: 'b', c: 'c', d: 'd' }
        expect(scan_attrs(inp)).toEqual(out)
    })

    test('mixed delimiters', () => {
        const inp = '   a=a  b="b"         c d="d\\"d"'
        const out = { a: 'a', b: 'b', c: 'c', d: 'd"d' }
        expect(scan_attrs(inp)).toEqual(out)
    })
})
