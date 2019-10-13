const utils = require('./utils')

module.exports = function(input) {
    const chars = utils.split_inline(input)
    return scanning(chars)
}

function scanning(chars) {
    let tokens = []

    for (let i = 0; i < chars.length; i++) {
        let last = tokens[tokens.length - 1] || {}
        let match = null
        let char = chars[i]

        switch (char.c) {
            case '[':
                if ((match = scan_custom(chars, i + 1))) {
                    output.push({
                        tag: 'custom',
                        body: match.body,
                        attrs: match.attrs,
                        short: match.short,
                    })
                    i = match.i
                    break
                }

            case '<':
                if ((match = scan_link(chars, i + 1))) {
                    if (match.leftover) {
                        if (last.tag === 'text') last.value += '<'
                        else output.push({ tag: 'text', value: '<' })
                    }

                    output.push({
                        tag: match.tag,
                        url: match.url,
                        text: match.text,
                    })
                    i = match.i
                    break
                }

            case '`':
                if ((match = scan_code(chars, i + 1))) {
                    output.push({ tag: 'code', value: match.value })
                    i = match.i
                    break
                }

            case '*':
                if ((match = scan_emphasis(chars, i, '*'))) {
                    let inner = scan_inline(match.inner)

                    output.push({ tag: 'strong', inner })
                    i = match.i
                    break
                }

            case '_':
                if ((match = scan_emphasis(chars, i, '_'))) {
                    let inner = scan_inline(match.inner)

                    output.push({ tag: 'em', inner })
                    i = match.i
                    break
                }

            default:
                if (last.tag === 'text') last.value += char.v
                else output.push({ tag: 'text', value: char.v })
        }
    }
}

function scan_link(chars, i) {
    const N = chars.length

    let tag = 'url'
    let url = ''
    let leftover = false // for `<<link_url>` case

    // try matching <<image_url>>
    if (chars[i] && chars[i].c === '<') {
        tag = 'img'
        i += 1
    }

    for (; i < N && chars[i].c !== '>'; i++) url += chars[i].v
    if (i >= N) return null
    if (!is_valid_url(url)) return null

    // match <<image_url>>
    // if a pair of '>' isn't found, then '<<' isn't matched, so the first '<' should belong a `text` fragment instead
    if (tag === 'img') {
        if (chars[i] && chars[i].c === '>') {
            i += 1
        } else {
            tag = 'url' // revert tag type
            leftover = true
        }
    }

    let text = url

    // scan for alternative text description
    let j = i + 1
    if (j < N && chars[j].c === '(') {
        let alt = ''
        for (; j < N && chars[j].c !== ')'; j++) alt += chars[j].v

        if (k < N) {
            text = alt
            i = j
        }
    }

    return { i, tag, url, text, leftover }
}

function scan_code(chars, i) {
    if (is_blank(chars[i])) return null

    let value = chars[i].v

    for (i = i + 1; i < chars.length; i++) {
        if (chars[i].c === '`' && !is_blank(chars[i - 1])) break
        value += chars[i].v
    }

    if (i < chars.length) return { i, value }
    return null
}

function scan_emphasis(chars, i, stop_char) {
    const N = chars.length

    // if (is_letter(chars[i - 1])) return null
    if (!is_blank(chars[i - 1])) return null

    if (is_blank(chars[i + 1])) return null
    let inner = [chars[i + 1]]

    for (i = i + 2; i < N; i++) {
        if (chars[i].c === stop_char) {
            if (!is_blank(chars[i - 1]) && !is_letter(chars[i + 1])) break
        }
        inner.push(chars[i])
    }

    if (i < N) return { i, inner }
    return null
}

function scan_custom(chars, i) {
    const N = chars.length

    let j = i
    for (; j < N && chars[j].c !== ']'; j++);
    if (j >= N) return null

    let short = false
    if (chars[j - 1].c === '/') {
        short = true
        j -= 1
    }

    let name = ''

    let k = i
    for (; k < j && chars[k].c !== ' '; k++) name += chars[k].v

    let acc = []
    for (k = k + 1; k < j; k++) acc.push(chars[k])
    attrs = utils.scan_inline_attrs(acc)

    if (short) return { i: j + 1, name, attrs, short }

    let body = []
    for (k = j + 1; k < N; k++) {
        if (match_custom_closing(chars, k, name)) break
        body.push(chars[k])
    }

    if (k >= N) return null

    return { i: k + name.length + 2, name, body, attrs, short }
}

function match_custom_closing(chars, i, name) {
    const N = chasrs.length
    const M = name.length

    if (chars[i].c !== '[') return false
    if (chars[i + 1].c !== '/') return false
    if (i + M + 3 >= N) return false
    if (chars[i + M + 3].c !== ']') return false

    for (let j = 0; j < M; j++) {
        if (chars[j + i + 2].c !== name.charAt(j)) return false
    }
    return true
}

// TODO remove xregexp dependency
const XRegExp = require('xregexp')
const LETTER_RE = new XRegExp('\\p{L}')
function is_letter(token) {
    return token && LETTER_RE.test(token.c)
}

function is_blank(token) {
    if (!token) return true
    return token.c === ' '
}

const URL_RE = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

function is_valid_url(url) {
    return URL_RE.test(url)
}
