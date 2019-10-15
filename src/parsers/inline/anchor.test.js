const parse_anchor = require('./anchor')

const { tokenize } = require('../utils')

function parse(input) {
    const tokens = tokenize(input)
    return parse_anchor(tokens, 0)
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
            tag: 'url',
            href: 'a.b',
            body: Array.from('a.b').map(x => [x, x]),
        },
        offset: inp.length - 1,
        skipped: false,
    }

    expect(parse(inp)).toEqual(out)
})

test('parses simple image', () => {
    const inp = '<<a.b>>'
    const out = {
        output: {
            tag: 'img',
            href: 'a.b',
            body: Array.from('a.b').map(x => [x, x]),
        },
        offset: inp.length - 1,
        skipped: false,
    }

    expect(parse(inp)).toEqual(out)
})

test('parses failed image markup', () => {
    const inp = '<<a.b>'
    const out = {
        output: {
            tag: 'url',
            href: 'a.b',
            body: Array.from('a.b').map(x => [x, x]),
        },
        offset: inp.length - 1,
        skipped: true,
    }

    expect(parse(inp)).toEqual(out)
})

test('parses link with text', () => {
    const inp = '<a.b>(c)'
    const out = {
        output: {
            tag: 'url',
            href: 'a.b',
            body: [['c', 'c']],
        },
        offset: inp.length - 1,
        skipped: false,
    }

    expect(parse(inp)).toEqual(out)
})

test('parses image with text', () => {
    const inp = '<<a.b>>(c)'
    const out = {
        output: {
            tag: 'img',
            href: 'a.b',
            body: [['c', 'c']],
        },
        offset: inp.length - 1,
        skipped: false,
    }

    expect(parse(inp)).toEqual(out)
})

test('parses links with text skipping first <', () => {
    const inp = '<<a.b>(c)'
    const out = {
        output: {
            tag: 'url',
            href: 'a.b',
            body: [['c', 'c']],
        },
        offset: inp.length - 1,
        skipped: true,
    }

    expect(parse(inp)).toEqual(out)
})
