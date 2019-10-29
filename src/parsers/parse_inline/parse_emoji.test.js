const parse_emoji = require('./parse_emoji')

const { tokenize } = require('../utils')

function parse(input) {
    const tokens = tokenize(input)
    return parse_emoji(tokens, 0)
}

function body_for(str) {
    return Array.from(str).map(x => [x, x])
}

test('valid emoji', () => {
    const inp = ':smile:'
    const out = {
        output: {
            tag: 'emoji',
            body: body_for('smile'),
        },
        offset: inp.length - 1,
    }

    expect(parse(inp)).toEqual(out)
})

test('invalid emoji', () => {
    expect(parse('::')).toEqual(null)
    expect(parse(': :')).toEqual(null)
    expect(parse(':x :')).toEqual(null)
    expect(parse(': x:')).toEqual(null)
    expect(parse(':x x:')).toEqual(null)
})
