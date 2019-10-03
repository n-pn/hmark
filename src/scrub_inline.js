module.exports = function scrub(input) {
    var chars = Array.from(input)

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

function render_token(token) {
    if (token.char == '<') return '&lt;'
    if (token.char == '>') return '&gt;'
    if (token.char == '\n') return '<br />\n'
    if (token.mark !== '\\') return token.char
    if (token.char == ' ') return '&nbsp;'
    return token.char
}

const url_re = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

function is_url(url) {
    return url_re.test(url)
}

function scrub_inline(tokens) {
    var out = ''

    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i]

        if (tok.mark == '<') {
            let url = ''
            let alt = []

            let j = i + 1
            let match = false

            while (j < tokens.length) {
                let curr = tokens[j]
                if (curr.mark == '>') {
                    match = true
                    break
                }
                url += curr.char
                alt.push(curr)
                j += 1
            }

            // check if url is a html tag
            if (match && is_url(url)) {
                // check for text
                url = encodeURI(url)

                let cur = tokens[j + 1]

                if (cur && cur.mark === '(') {
                    let valid = false
                    let acc = []

                    let k = j + 2
                    while (k < tokens.length) {
                        let tk = tokens[k]
                        if (tk.mark == ')') {
                            valid = true
                            break
                        }
                        acc.push(tk)
                        k += 1
                    }

                    if (valid) {
                        alt = acc
                        j = k
                    }
                }

                const prev = tokens[i - 1]
                if (prev && prev.mark === '!') {
                    out = out.slice(0, -1)
                    alt = alt.map(x => render_token(x)).join('')
                    out += `<img src="${url}" alt="${alt}"/>`
                } else {
                    alt = scrub_inline(alt)
                    out += `<a href="${url}" rel="noopener noreferrer">${alt}</a>`
                }

                i = j
                continue
            }
        }

        if (tok.mark === '*' || tok.mark === '_' || tok.mark === '`') {
            let next = tokens[i + 1]

            if (is_char(next)) {
                let j = i + 2
                let acc = [next]
                let prev = next
                let match = false

                while (j < tokens.length) {
                    let curr = tokens[j]
                    if (is_char(prev) && curr.mark === tok.mark) {
                        match = true
                        break
                    }
                    j += 1
                    prev = curr
                    acc.push(curr)
                }

                if (match) {
                    if (tok.mark === '*') {
                        out += `<strong>${scrub_inline(acc)}</strong>`
                    } else if (tok.mark === '_') {
                        out += `<em>${scrub_inline(acc)}</em>`
                    } else {
                        var inner = acc.map(x => render_token(x)).join('')
                        out += `<code>${inner}</code>`
                    }

                    i = j
                    continue
                }
            }
        }

        out += render_token(tok)
    }

    return out
}

function is_char(token) {
    if (!token) return false
    return token.mark !== ' '
}

function may_escape(char) {
    switch (char) {
        case '=': // heading
        case '>': // block quote, close text link
        case '-': // unordered list
        case '+': // auto ordered list
        case '<': // before text link
        // case '!': // mark link is image
        case '"': // double quote
        case "'": // single quote
        case '#': // hash tag
        case '@': // at tag
        case '[': // task list, link text, open mark
        case ']': // close task list or link text, close mark
        case ':': // emoji or inside mark
        case '`': // code
        case '*': // bold
        case '/': // italic, inside mark
        case ' ': // escape whitespace
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
