const { tokenize } = require('./utils')

module.exports = (input, opts = {}) => {
    if (typeof input === 'string') input = tokenize(input)
    return parse(input, opts)
}

const parsers = {
    '`': { id: 'code', fn: require('./inline/code') },
    '<': { id: 'link', fn: require('./inline/link') },
    '!': { id: 'image', fn: require('./inline/image') },
    ':': { id: 'emoji', fn: require('./inline/emoji') },
    '[': { id: 'custom', fn: require('./inline/custom') },
    '*': { id: 'emphasis', fn: require('./inline/emphasis') },
    '_': { id: 'emphasis', fn: require('./inline/emphasis') },
}

function parse(input, opts = {}) {
    let output = []
    let match = null

    for (let i = 0; i < input.length; i++) {
        let parser = parsers[input[i][0]]

        if (parser && opts[parser.id] !== false) {
            if ((match = parser.fn(input, i))) {
                if (parser.id === 'emphasis') {
                    match.output.body = parse(match.output.body, opts)
                }
                output.push(match.output)
                i = match.offset
                continue
            }
        }

        let last = output[output.length - 1] || {}
        let curr = input[i]
        if (last.tag === 'text') last.body.push(curr)
        else output.push({ tag: 'text', body: [curr] })
    }

    return output
}
