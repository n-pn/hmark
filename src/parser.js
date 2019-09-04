function parse(input) {
  return parse_regular_block(input)
}

function parse_regular_block(input) {}

function parse_special_block(input) {}

function parse_regular_inline(input) {}

function parse_special_inline(input) {
  if (!input) return []
  console.log('input: ' + input)

  const re = /(.*?)([_*~^`])(.+?)\2(.*?)/g
  const match = re.exec(input)
  console.log(match)

  if (!match) return [{ type: 'text', body: input }]

  let out = []

  const before = match[1]
  if (before !== '') out.push({ type: 'text', body: before })

  out.push({
    type: special_inline_name(match[2]),
    body: parse_special_inline(match[3]),
  })

  const after = match[4]
  if (after !== '') out = out.concat(parse_special_inline(after))

  return out
}

function special_inline_name(mark) {
  switch (mark) {
    case '*':
      return 'si:bold'
    case '_':
      return 'si:italic'
    case '^':
      return 'si:superscript'
    case '~':
      return 'si:subscript'
  }
}

module.exports = parse

// console.log(parse_special_inline('text'))
// console.log(parse_special_inline('*bold*'))
// console.log(parse_special_inline('text *bold* text2'))
// console.log(parse_special_inline('text * bold * text2'))
console.log(parse_special_inline('text *^ bold ^* text2'))
