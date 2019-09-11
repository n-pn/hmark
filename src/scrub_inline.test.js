const scrub = require('./scrub_inline')

function test(input) {
  console.log({
    src: input,
    out: scrub(input),
  })
}

test('\\===')
test('\\\\*unbold*')
test('*unbold*\\\\')
test('\\*unbold*')
test('*unbold*\\')
test('*bold*')
test('/italic/')
test('*/bold and italic/*')
test('/*bold and italic*/')
test('*bold and \nbreak*')
test('*bold and break\n/italic/*')
test('test *bold* then /italic/ extra')
test('`*/code/*`')
test('`\\``')
