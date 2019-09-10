module.exports = function parse(input) {
  const lines = input.replace(/\r\n|\n\r|\n|\r/g, '\n').split('\n')

  return parse_block(lines)
}

const empty_re = /^\s*$/
const ruler_re = /^\s*-{3,}\s*$/
const headings_re = /^\s*(={1,6})(.+)$/
const table_re = /^\s*\|(.+)\|\s*$/
const blockquote_re = /^\s*>(.+)$/
const codeblock_begin_re = /^\s*```(.*?)\s*$/
const codeblock_close_re = /^\s*```\s*$/
const tasklist_re = /^\s*-\s*\[( |x)\](.+)$/
const nested_block_re = /^\s{2,}(.+)$/
const ordered_list_re = /^\s*(\d+)\.(.+)$/
const unordered_list_re = /^\s*-(.+)$/

function parse_block(lines) {
  var output = []
  var idx = 0

  while (idx < lines.length) {
    const line = lines[idx]

    // match empty lines
    var raw = []
    while ((match = line.match(empty_re))) {
      raw.push(line)
      idx += 1
      line = lines[idx]
    }
    if (raw.length > 0) output.push({ tag: 'br', raw })

    // match rulers
    // TODO: match rulers with captions
    if ((match = line.match(ruler_re))) {
      output.push({ tag: 'hr', raw })
      idx += 1
      continue
    }

    // match heading level 1-6
    if ((match = line.match(headings_re))) {
      let tag = 'h' + match[1].length
      let content = match[2]

      output.push({ tag, raw: line, ctx: parse_inline(content) })
      idx += 1
      continue
    }

    // match table
    raw = []
    while ((match = line.match(table_re))) {
      raw.push(line)
      idx += 1
      line = lines[idx]
    }
    if (raw.length > 0) {
      let ctx = raw.map(x => x.split('|'))
      // TODO: detect thead
      // TODO: expand empty table cell
      // TODO: parsing table cell
      output.push({ tag: 'table', raw, ctx })
    }

    // match blockquote
    raw = []
    while ((match = line.match(blockquote_re))) {
      raw.push(line)
      idx += 1
      line = lines[idx]
    }
    if (raw.length > 0) {
      let ctx = parse_block(raw)
      output.push({ tag: 'blockquote', raw, ctx })
    }

    // match paragraphs
    raw = []
    while (!line.match(empty_re)) {
      raw.push(line)
      idx += 1
      line = lines[idx]
    }
    let ctx = raw.map(line => parse_inline(line))
    output.push({ tag: 'p', raw, ctx })
  }

  return output
}

function parse_inline(input) {
  if (!input) return []

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
      return 'sp:strong'
    case '_':
      return 'sp:em'
    case '^':
      return 'sp:sup'
    case '~':
      return 'sp:sub'
  }
}
