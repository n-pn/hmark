module.exports = function parse_emoji(input, offset) {
    const output = { tag: 'emoji', body: [] }

    offset += 1
    for (; offset < input.length; offset++) {
        let curr = input[offset]
        if (curr[0] === ':') break
        else if (/[^\w]/.test(curr[0])) return null
        else output.body.push(curr)
    }

    // console.log({ output })
    if (offset < input.length && output.body.length > 0)
        return { output, offset }
    return null
}
