const hmark = require('../index.js')

exports.hmark = hmark

exports.assert = (input, output) => {
    expect(hmark(input)).toEqual(output)
}
