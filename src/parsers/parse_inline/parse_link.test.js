const parse_link = require('./parse_link')

const { tokenize } = require('../utils')

function parse(input) {
    const tokens = tokenize(input)
    return parse_link(tokens, 0)
}

test('ignores html tags', () => {
    expect(parse('<a b>')).toEqual(null)
    expect(parse('<a>')).toEqual(null)
    expect(parse('</a>')).toEqual(null)
})

test('parses simple link', () => {
    const inp = '<a.b>'
    const out = {
        output: {
            tag: 'link',
            href: 'a.b',
            body: Array.from('a.b').map(x => [x, x]),
        },
        offset: inp.length - 1,
    }

    expect(parse(inp)).toEqual(out)
})

test('parses link with text', () => {
    const inp = '<a.b>(c)'
    const out = {
        output: {
            tag: 'link',
            href: 'a.b',
            body: [['c', 'c']],
        },
        offset: inp.length - 1,
    }

    expect(parse(inp)).toEqual(out)
})
