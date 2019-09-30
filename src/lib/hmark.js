export default function hmark(input) {
    // TODO
    const lines = split_lines(input)
    // return scrub_block(lines)
    return lines.map(x => `<p>${x}</p>\n`)
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
    let out = []
    let acc = []
    let idx = 0

    while (idx < lines.length) {
        console.log({ idx })
        let line = lines[idx]

        let match = line.match(empty_re)
        if (match) {
            idx += 1
            continue
        }

        if ((match = line.match(ruler_re))) {
            out.push(`<hr />`)
            idx += 1
            continue
        }

        acc = []
        while (!line.match(empty_re)) {
            acc.push(line)
            idx += 1
            if (idx >= lines.length) break
            line = lines[idx + 1]
        }
        if (acc.length > 0) {
            let inner = scrub_inline(acc.join('\n'))
            out.push(`<p>${inner}</p>`)
        }
    }

    return out.join('\n')
}

function scrub_inline(input) {
    // console.log({ line: input })

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

    return do_scrub_inline(out)
}

function do_scrub_inline(tokens) {
    var out = ''

    for (let i = 0; i < tokens.length; i++) {
        const { mark, char } = tokens[i]

        if (mark == '*' || mark == '/' || mark == '`') {
            if (boundary(tokens[i - 1])) {
                var j = i + 1
                var acc = []

                while (j < tokens.length) {
                    const curr = tokens[j]

                    if (curr.mark == mark && boundary(tokens[j + 1])) break
                    else {
                        acc.push(curr)
                        j += 1
                    }
                }

                if (j < tokens.length) {
                    if (mark == '*') {
                        out += `<strong>${scrub_inline(acc)}</strong>`
                    } else if (mark == '/') {
                        out += `<em>${scrub_inline(acc)}</em>`
                    } else {
                        var inner = acc.map(x => x.char).join('')
                        out += `<code>${inner}</code>`
                    }

                    i = j
                    continue
                }
            }
        } else if (mark == '\n') out += '<br/>'

        out += char
    }

    return out
}

function boundary(token) {
    return !(token && token.mark !== ' ')
}

function may_escape(token) {
    switch (token) {
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
        // case ' ': // escape whitespace
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

function split_lines(input) {
    // TODO: recheck this regex
    return input.replace(/\r\n|\n\r|\r/g, '\n').split('\n')
}

function escape_html(text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function encode_link(link) {
    return encodeURI(link)
}
