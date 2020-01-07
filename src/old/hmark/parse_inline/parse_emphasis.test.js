const parse_emphasis = require('./parse_emphasis')

const { tokenize } = require('../parse_utils')

function parse(input) {
    const tokens = tokenize(input)
    return parse_emphasis(tokens, 0)
}

function body_for(str) {
    return Array.from(str).map(x => [x, x])
}

test('recognizes italic', () => {
    const inp = '_a_'
    const out = {
        output: {
            tag: 'em',
            body: body_for('a'),
        },
        offset: inp.length - 1,
    }

    expect(parse(inp)).toEqual(out)
})

test('recognizes bold', () => {
    const inp = '*a b*'
    const out = {
        output: {
            tag: 'strong',
            body: body_for('a b'),
        },
        offset: inp.length - 1,
    }

    expect(parse(inp)).toEqual(out)
})

test('ignores invalid', () => {
    expect(parse('a*b*c')).toEqual(null)
    expect(parse('a*b*')).toEqual(null)
    expect(parse('*a*b')).toEqual(null)
    expect(parse('* a*')).toEqual(null)
    expect(parse('*a *')).toEqual(null)

    expect(parse('a_b_c')).toEqual(null)
    expect(parse('a_b_')).toEqual(null)
    expect(parse('_a_b')).toEqual(null)
    expect(parse('_ a_')).toEqual(null)
    expect(parse('_a _')).toEqual(null)
})
