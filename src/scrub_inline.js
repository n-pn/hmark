module.exports = function scrub(input) {
  const chars = Array.from(input)

  var out = []

  for (var i = 0; i < chars.length; i++) {
    const mark = chars[i]
    const next = chars[i + 1]

    if (mark == '\\' && may_escape(next)) {
      out.push({ mark, char: next })
      i += 1
    } else out.push({ mark, char: mark })
  }

  return scrub_inline(out)
}

function scrub_inline(tokens) {
  // console.log({ tokens })
  var out = ''

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    switch (token.mark) {
      case '*':
      case '/':
      case '`':
        if (is_flank(tokens[i - 1])) {
          var j = i + 1
          var acc = []

          while (j < tokens.length) {
            const curr = tokens[j]

            if (curr.mark == token.mark && is_flank(tokens[j + 1])) break
            else {
              acc.push(curr)
              j += 1
            }
          }

          if (j < tokens.length) {
            if (token.mark == '*') {
              out += `<strong>${scrub_inline(acc)}</strong>`
            } else if (token.mark == '/') {
              out += `<em>${scrub_inline(acc)}</em>`
            } else {
              var inner = acc.map(x => x.char).join('')
              out += `<code>${inner}</code>`
            }
            i = j
          } else {
            out += token.char
          }
        } else out += token.char

        break

      default:
        out += token.char
    }
  }

  return out
}

function is_flank(token) {
  if (!token) return true
  return token.mark == ' '
}

function may_escape(token) {
  switch (token) {
    case '=': // heading
    case '>': // block quote, close text link
    case '-': // unordered list
    case '+': // auto ordered list
    case ' ': // escape whitespace
    case '<': // before text link
    case '!': // mark link is image
    case '"': // double quote
    case "'": // single quote
    case '#': // hash tag
    case '@': // at tag
    case '[': // task list, link text
    case ']': // close task list or link text
    case ':': // emoji or inside mark
    case '`': // code
    case '*': // bold
    case '/': // italic, inside mark
    case '{': // open mark
    case '}': // close mark
    // case '~':
    // case '$':
    // case '%':
    // case '&':
    // case '(':
    // case ')':
    // case ',':
    // case '.':
    // case ';':
    // case '?':
    // case '|':
    case '\\': // escape self
      return true
    default:
      return false
  }
}
