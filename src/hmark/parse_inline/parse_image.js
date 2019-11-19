const parse_link = require('./parse_link')

module.exports = function(input, offset = 0) {
    if (!input[offset + 1] || input[offset + 1][0] !== '<') return null

    const match = parse_link(input, offset + 1)
    if (!match) return null

    match.output.tag = 'image'
    return match
}
