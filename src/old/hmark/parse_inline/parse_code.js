module.exports = function parse_code(input, offset) {
    const next = input[offset + 1]
    if (!next || next[0] === ' ') return null

    const output = { tag: 'code', body: [next] }

    offset += 2
    for (; offset < input.length; offset++) {
        let curr = input[offset]

        if (curr[0] === '`') break
        else output.body.push(curr)
    }

    if (offset < input.length) return { output, offset }
    return null
}
