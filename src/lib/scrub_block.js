const scrub_inline = require('./scrub_inline')

module.exports = function hmark(input) {
    const lines = input.replace(/\r\n|\n\r|\r/g, '\n').split('\n')
    return scrub_block(lines)
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

        // match heading level 1-6
        if ((match = line.match(headings_re))) {
            let tag = 'h' + match[1].length
            // out.push({ tag, acc: line, ctx: scrub_inline(match[2]) })

            let inner = scrub_inline(match[2])
            out.push(`<${tag}>${inner}</${tag}>`)
            idx += 1
            continue
        }

        // match blockquote
        acc = []
        while ((match = line.match(blockquote_re))) {
            acc.push(match[1])
            idx += 1
            if (idx >= lines.length) break
            line = lines[idx]
        }
        if (acc.length > 0) {
            console.log(acc)
            out.push(`<blockquote>${scrub_block(acc)}</blockquote>`)
        }

        if (idx >= lines.length) break

        acc = []
        while (!line.match(empty_re)) {
            acc.push(line)
            idx += 1
            if (idx >= lines.length) break
            line = lines[idx]
        }
        if (acc.length > 0) {
            // let inner = acc.join('<br />\n')
            let inner = scrub_inline(acc.join('\n'))
            out.push(`<p>${inner}</p>`)
        }
    }

    return out.join('\n')
}
