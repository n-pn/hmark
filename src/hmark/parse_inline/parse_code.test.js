const parse_code = require('./parse_code')

const { tokenize } = require('../parse_utils')

function parse(input) {
    const tokens = tokenize(input)
    return parse_code(tokens, 0)
}

test('parses simple code', () => {
    const inp = '`xy`'
    const out = {
        output: {
            tag: 'code',
            body: [['x', 'x'], ['y', 'y']],
        },
        offset: inp.length - 1,
    }

    expect(parse(inp)).toEqual(out)
})

test('ignores blank character', () => {
    const inp = '` x`'
    const out = null
    expect(parse(inp)).toEqual(out)
})

test('ignores empty pair', () => {
    const inp = '``'
    const out = null
    expect(parse(inp)).toEqual(out)
})

test('allow ` inside', () => {
    const inp = '```'
    const out = {
        output: {
            tag: 'code',
            body: [['`', '`']],
        },
        offset: inp.length - 1,
    }

    expect(parse(inp)).toEqual(out)
})

test('non greedy parsing', () => {
    const inp = '`````'
    const out = {
        output: {
            tag: 'code',
            body: [['`', '`']],
        },
        offset: 2,
    }

    expect(parse(inp)).toEqual(out)
})
