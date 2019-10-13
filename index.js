const render_blocks = require('./src/render_blocks')
const scan_blocks = require('./src/scan_blocks')
const render_inline = require('./src/render_inline')
const scan_inline = require('./src/scan_inline')

function hmark(input) {
    return render_blocks(input)
}

module.exports = {
    hmark,
    render_blocks,
    render_inline,
    scan_blocks,
    scan_inline,
}
