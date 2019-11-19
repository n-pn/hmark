const render_blocks = require('./src/render_block')

module.exports = (input, options) => {
    const lines = input.replace(/\r\n|\n\r|\r/g, '\n').split('\n')
    return render_blocks(lines)
}
