const utils = require('./utils')

module.exports = function hmark(input, options = {}) {
  // TODO: Add default options
  const lines = split_files(input)
  console.log({ lines })
  return scrub_block(lines)
}

function split_files(input) {
  // TODO: recheck this regex
  return input.replace(/\r\n|\n\r|\n|\r/g, '\n').split('\n')
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

function scrub_block(lines) {
  var out = []
  var acc = []
  var idx = 0

  while (idx < lines.length) {
    var line = lines[idx]

    // match empty lines
    acc = []
    while ((match = line.match(empty_re))) {
      acc.push(line)
      idx += 1
      if (idx < lines.length) line = lines[idx]
      else break
    }
    if (acc.length > 0) {
      // if (!options.compact) out.push(acc.join('\n'))
      if (idx >= lines.length) break
    }

    // match rulers
    // TODO: match rulers with captions
    if ((match = line.match(ruler_re))) {
      // out.push({ tag: 'hr', acc })
      out.push(`<hr>`)
      idx += 1
      continue
    }

    // match heading level 1-6
    if ((match = line.match(headings_re))) {
      let tag = 'h' + match[1].length
      // out.push({ tag, acc: line, ctx: scrub_inline(match[2]) })

      let inner = scrub_inline(match[2])
      out.push(`<${tag}>${inner}</${tag}>`)
      idx += 1
      continue
    }

    // match table
    acc = []
    while ((match = line.match(table_re))) {
      acc.push(line)
      idx += 1
      if (idx < lines.length) line = lines[idx]
      else break
    }
    if (acc.length > 0) {
      let data = acc.map(x => x.split('|'))
      // TODO: detect thead
      // TODO: expand empty table cell
      // TODO: parsing table cell
      // TODO: render table
      let inner = ''
      out.push(`<table>${inner}</table>`)

      if (idx >= lines.length) break
    }

    // match blockquote
    acc = []
    while ((match = line.match(blockquote_re))) {
      acc.push(line)
      idx += 1
      if (idx < lines.length) line = lines[idx]
      else break
    }
    if (acc.length > 0) {
      out.push(`<blockquote>${scrub_block(acc)}</blockquote>`)
    }

    // match paragraphs
    acc = []
    while (!line.match(empty_re)) {
      acc.push(line)
      idx += 1
      if (idx < lines.length) line = lines[idx]
      else break
    }
    let inner = scrub_inline(acc.join('\n'))
    out.push(`<p>${inner}</p>`)
  }

  return out.join('\n')
}

function scrub_inline(input) {
  console.log({ line: input })

  var chars = Array.from(input)
  var out = ''
  var acc = ''
  var idx = 0

  var boundary = true

  while (idx < chars.length) {
    var char = chars[idx]
    switch (char) {
      case '\\':
        var next = chars[idx + 1]
        if (can_escape(next)) {
          idx += 2
          out += next
          continue
        } else {
          idx += 1
          out += char
          continue
        }

      case ' ':
      case '\t':
        boundary = true
        idx += 1
        out += char
        continue

      default:
        idx += 1
        out += char
    }
  }
  return out
}

function can_escape(char) {
  // re = /[ !"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~]/
  switch (char) {
    case ' ':
    case '!':
    case '"':
    case '#':
    case '$':
    case '%':
    case '&':
    case "'":
    case '(':
    case ')':
    case '*':
    case '+':
    case ',':
    case '-':
    case '.':
    case ':':
    case ';':
    case '<':
    case '=':
    case '>':
    case '?':
    case '@':
    case '[':
    case '\\':
    case ']':
    case '{':
    case '|':
    case '}':
    case '~':
    case '/':
      return true
    default:
      return false
  }
}

console.log(scrub_block(['\\\\*bold*']))
console.log(scrub_inline('\\\\*bold*'))
console.log(scrub_inline('\\==='))
