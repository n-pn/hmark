module.exports = function scan_emphasis(input, offset = 0) {
    if (invalid_left(input, offset)) return null

    const mark = input[offset][0]

    const output = {
        tag: mark === '*' ? 'strong' : 'em',
        body: [input[offset + 1]],
    }

    offset += 2
    for (; offset < input.length; offset++) {
        let curr = input[offset]
        if (curr[0] === mark && !invalid_right(input, offset)) break
        else output.body.push(curr)
    }

    if (offset < input.length) return { output, offset }
    return null
}

function invalid_left(input, i) {
    return is_alnum(input[i - 1]) || is_space(input[i + 1])
}

function invalid_right(input, i) {
    return is_space(input[i - 1]) || is_alnum(input[i + 1])
}

function is_alnum(pair) {
    if (!pair) return false
    if (pair[0].toUpperCase() !== pair[0].toLowerCase()) return true
    // TODO: handle more unicode letters like CJK charset
    return /[-_0-9]/.test(pair[0])
}

function is_space(pair) {
    if (!pair) return true
    return pair[0] === ' '
}
