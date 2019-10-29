const parse_image = require('./parse_image')

const { tokenize } = require('../utils')

function parse(input) {
    const tokens = tokenize(input)
    return parse_image(tokens, 0)
}

test('parses simple image', () => {
    const inp = '!<a.b>'
    const out = {
        output: {
            tag: 'image',
            href: 'a.b',
            body: Array.from('a.b').map(x => [x, x]),
        },
        offset: inp.length - 1,
    }

    expect(parse(inp)).toEqual(out)
})

test('parses image with text', () => {
    const inp = '!<a.b>(c)'
    const out = {
        output: {
            tag: 'image',
            href: 'a.b',
            body: [['c', 'c']],
        },
        offset: inp.length - 1,
    }

    expect(parse(inp)).toEqual(out)
})
