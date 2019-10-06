const utils = require('./parse_utils')

module.exports = function parse(input) {
    const lines = input
        .replace(/\t/g, '    ') // convert tabs to 4 spaces
        .replace(/\r\n|\n\r|\r/g, '\n') // convert to `lf` unix line ending
        .split('\n')

    return parse_block(lines)
}

function parse_block(lines) {
    const trims = lines.map(x => x.trim())

    let output = []
    let i = 0

    while (i < lines.length) {
        let last = output[output.length - 1] || {}

        // let line = lines[i]
        let trim = trims[i]

        // for empty lines
        if (trim === '') {
            output.push({ tag: 'br' })
            i += 1
            continue
        }

        switch (trim.charAt(0)) {
            // headings
            case '=':
                let h_lv = 1
                while (h_lv < 6 && trim.charAt(h_lv) === '=') h_lv += 1

                output.push({
                    tag: 'h' + h_lv,
                    inner: trim.substring(h_lv),
                })

                i += 1
                continue

            // blockquote
            case '>':
                let bq_text = trim.substring(1)

                if (last.tag == 'blockquote') {
                    last.inner.push(bq_text)
                } else {
                    output.push({ tag: 'blockquote', inner: [bq_text] })
                }

                i += 1
                continue

            // ordered list
            case '+':
                let ol_inner = [trim.substring(1)]

                // scan for list item's nested content
                let ol_j = i + 1

                while (ol_j < ol_inner.length) {
                    let line = lines[j]

                    if (!utils.is_blank(line.charAt(0))) break
                    if (!utils.is_blank(line.charAt(1))) break

                    ol_inner.push(line.substring(2))
                    ol_j += 1
                }

                if (last.tag == 'ol') {
                    last.items.push(ol_inner)
                } else {
                    output.push({ tag: 'ol', items: [ol_inner] })
                }

                i = ol_j
                continue

            // ruler or unordered list
            case '-':
                // check ruler

                if (/^-{3,}$/.test(trim)) {
                    output.push({ tag: 'hr' })

                    i += 1
                    continue
                }

                // for unordered list
                let ul_inner = [trim.substring(1)]

                // scan for list item's nested content
                let ul_j = i + 1

                while (ul_j < ul_inner.length) {
                    let line = lines[j]

                    if (!utils.is_blank(line.charAt(0))) break
                    if (!utils.is_blank(line.charAt(1))) break

                    ul_inner.push(line.substring(2))
                    ul_j += 1
                }

                if (last.tag == 'ul') {
                    last.items.push(ul_inner)
                } else {
                    output.push({ tag: 'ul', items: [ul_inner] })
                }

                i = ul_j
                continue

            // check list or div block
            case '[':
                let char = trim.charAt(1)

                // check task list
                if (trim.charAt(2) === ']' && (char === ' ' || char === 'x')) {
                    let task = {
                        done: char === 'x',
                        text: trim.substring(3),
                    }

                    if (last.tag == 'tl') {
                        last.items.push(task)
                    } else {
                        output.push({ tag: 'tl', items: [task] })
                    }

                    i += 1
                    continue
                }

                // check custom div block
                if (
                    char === '[' &&
                    trim.charAt(trim.length - 1) === ']' &&
                    trim.charAt(trim.length - 2) === ']'
                ) {
                    let [name, attrs] = utils.split_once(trim)

                    // is self closed
                    if (attrs.charAt(attrs.length - 1) === '/') {
                        attrs = attrs.substring(0, attrs.length - 1)

                        output.push({
                            tag: 'div',
                            name,
                            attrs: utils.parse_attrs(attrs),
                            short: true,
                        })

                        i += 1
                        continue
                    }

                    // check for closing tag
                    let close_tag = `[[/${name}]]`
                    let close_pos = i + 1

                    while (
                        close_pos < lines.length &&
                        trims[close_pos] !== close_tag
                    ) {
                        close_pos += 1
                    }

                    // if a closing tag is really found
                    if (close_pos < lines.length) {
                        let body = []
                        for (let j = i + 1; j < close_pos; j++) {
                            body.push(lines[j])
                        }

                        output.push({
                            tag: 'div',
                            name,
                            body: body.join('\n'),
                            attrs: utils.parse_attrs(attrs),
                            short: false,
                        })

                        i = close_pos + 1
                        continue
                    }
                }

            // table
            case '|':
                // make sure table line ends with a '|', ignore otherwise
                if (trim.charAt(trim.length - 1) === '|') {
                    let cols = trim.substring(1, trim.length - 1).split('|')

                    if (last.tag == 'table') {
                        last.rows.push(cols)
                    } else {
                        output.push({ tag: 'table', rows: [cols] })
                    }

                    i += 1
                    continue
                }

            // normal paragraph
            default:
                if (last.tag === 'p') {
                    last.inner += '\n' + trim
                } else {
                    output.push({ tag: 'p', inner: trim })
                }

                i += 1
        }
    }

    return output
}
