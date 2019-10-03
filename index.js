const scrub_block = require('./src/scrub_block')
const scrub_inline = require('./src/scrub_inline')

function hmark(input) {
  return scrub_block(input)
}

module.exports = { hmark, scrub_block, scrub_inline }
