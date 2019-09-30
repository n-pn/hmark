const scrub_inline = require('./scrub_inline')

module.exports = function hmark(input) {
    const lines = input.replace(/\r\n|\n\r|\r/g, '\n').split('\n')
    return scrub_block(lines)
}

const empty_re = /^\s*$/
const ruler_re = /^\s*-{3,}\s*$/
const headings_re = /^\s*(={1,6})(.+)$/
const blockquote_re = /^\s*>(.+)$/
const codeblock_begin_re = /^\s*(`{3,})(.*?)\s*$/
const tasklist_re = /^\s*-\s*\[( |x)\](.+)$/
const nested_block_re = /^\s{2,}(.+)$/
const ordered_list_re = /^\s*(\d+)\.(.+)$/
const unordered_list_re = /^\s*-(.+)$/

function scrub_block(lines) {
    let out = ''
    let i = 0

    while (i < lines.length) {
        let line = lines[i]

        // match empty line
        let match = line.match(empty_re)
        if (match) {
            i += 1
            continue
        }

        // match rulers
        if ((match = line.match(ruler_re))) {
            console.log({ ruler: i })

            out += `<hr />\n`
            i += 1
            continue
        }

        // match heading level 1-6
        if ((match = line.match(headings_re))) {
            console.log({ heading: i })

            let tag = 'h' + match[1].length
            // out.push({ tag, acc: line, ctx: scrub_inline(match[2]) })

            let inner = scrub_inline(match[2])
            out += `<${tag}>${inner}</${tag}>\n`
            i += 1
            continue
        }

        // match code block
        if ((match = line.match(codeblock_begin_re))) {
            console.log({ code_block: i })

            let mark = match[1]
            let lang = match[2] || 'text'

            let valid = false
            let closing_re = new RegExp(`\s*${mark}\s*`)

            let acc = []
            let j = i + 1

            while (j < lines.length) {
                let cur = lines[j]
                if (cur.match(closing_re)) {
                    valid = true
                    break
                }
                acc.push(cur)
                j += 1
            }

            if (valid) {
                console.log({ close_code: j })

                let code = acc.join('\n')
                out += render_code_block(code, lang)
                i = j + 1
                continue
            }
        }

        // match blockquote
        if ((match = line.match(blockquote_re))) {
            console.log({ blockquote: i })

            let acc = [match[1]]
            let j = i + 1

            while (j < lines.length) {
                line = lines[j]
                if ((match = line.match(blockquote_re))) {
                    acc.push(match[1])
                    j += 1
                }
                break
            }
            out += `<blockquote>${scrub_block(acc)}</blockquote>\n`
            i = j
            // continue
        }

        // match paragraphs

        console.log({ paragraph: i })

        let acc = []

        while (i < lines.length) {
            line = lines[i]
            if (line.match(empty_re)) break
            acc.push(line)
            i += 1
        }

        if (acc.length > 0) {
            let inner = scrub_inline(acc.join('\n'))
            out += `<p>${inner}</p>`
        }
    }

    return out
}

function render_code_block(code, lang) {
    // TODO: syntax highlight
    const data = code.split('\n').join('\n')
    return `<pre><code data-lang="${lang}">${data}</code></pre>`
}
