const scrub_inline = require('./scrub_inline')
const highlight = require('./utils/highlight')

module.exports = function hmark(input) {
    const lines = input.replace(/\r\n|\n\r|\r/g, '\n').split('\n')
    return scrub_block(lines)
}

const empty_re = /^\s*$/
const ruler_re = /^\s*-{3,}\s*$/
const headings_re = /^\s*(={1,6})(.+)$/
const blockquote_re = /^\s*>(.+)$/
const codeblock_begin_re = /^\s*(`{3,})(.*?)\s*$/
const ordered_list_re = /^\s*\+(.+)$/
const unordered_list_re = /^\s*-(.+)$/
const tasklist_re = /^\s*\[( |x)\](.+)$/
const nested_block_re = /^\s{2,}/
const table_block_re = /^\s*\|(.+)\|\s*$/

function scrub_block(lines) {
    let output = ''
    let para = []
    let i = 0

    while (i < lines.length) {
        if (empty_re.test(lines[i])) {
            output += render_para(para)
            para = []

            i += 1
            continue
        }

        // match rulers
        if ((match = lines[i].match(ruler_re))) {
            output += render_para(para)
            para = []

            output += `<hr />\n`

            i += 1
            continue
        }

        // match heading level 1-6
        if ((match = lines[i].match(headings_re))) {
            output += render_para(para)
            para = []

            let tag = 'h' + match[1].length
            let inner = scrub_inline(match[2])
            output += `<${tag}>${inner}</${tag}>\n`

            i += 1
            continue
        }

        let table_lines = []
        while (i < lines.length) {
            let match = lines[i].match(table_block_re)
            if (!match) break
            table_lines.push(match[1].split('|'))
            i += 1
        }

        if (table_lines.length > 0) {
            output += render_para(para)
            para = []

            output += `<table>\n${render_table(table_lines)}</table>\n`
        }

        // match code block
        if ((match = lines[i].match(codeblock_begin_re))) {
            // console.log({ code_block: i })

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
                // console.log({ close_code: j })
                output += render_para(para)
                para = []

                let code = acc.join('\n')
                output += render_code_block(code, lang)

                i = j + 1
                continue
            }
        }

        // match blockquote
        if ((match = lines[i].match(blockquote_re))) {
            output += render_para(para)
            para = []

            // console.log({ blockquote: i })

            let acc = [match[1]]
            let j = i + 1

            while (j < lines.length) {
                line = lines[j]
                match = line.match(blockquote_re)

                if (!match) break
                acc.push(match[1])
                j += 1
            }

            output += `<blockquote>${scrub_block(acc)}</blockquote>\n`
            i = j
            // continue
        }

        // match ordered lists
        let ordered_list = ''

        while (i < lines.length) {
            match = lines[i].match(ordered_list_re)
            if (!match) break

            let acc = [match[1]]
            let j = i + 1

            while (j < lines.length) {
                line = lines[j]

                if (empty_re.test(line) || nested_block_re.test(line)) {
                    acc.push(line.replace(/^\s\s/, ''))
                    j += 1
                } else break
            }

            i = j
            ordered_list += '<li>\n' + scrub_block(acc) + '</li>\n'
        }

        if (ordered_list !== '') {
            output += render_para(para)
            para = []

            output += '<ol>\n' + ordered_list + '</ol>\n'
            continue
        }

        // match unordered lists
        let unordered_list = ''

        while (i < lines.length) {
            match = lines[i].match(unordered_list_re)
            if (!match) break

            let acc = [match[1]]
            let j = i + 1

            while (j < lines.length) {
                line = lines[j]

                if (empty_re.test(line) || nested_block_re.test(line)) {
                    acc.push(line.replace(/^\s\s/, ''))
                    j += 1
                } else break
            }

            i = j
            unordered_list += '<li>\n' + scrub_block(acc) + '</li>\n'
        }

        if (unordered_list !== '') {
            output += render_para(para)
            para = []

            output += '<ul>\n' + unordered_list + '</ul>\n'
            continue
        }

        // match unordered lists
        let task_list = ''

        while (i < lines.length) {
            match = lines[i].match(tasklist_re)
            if (!match) break

            let status = match[1] == 'x' ? 'checked' : 'uncheck'
            let content = match[2]

            task_list += `<li class="${status}">`
            task_list += scrub_inline(content)
            task_list += '</li>\n'

            i += 1
            line = lines[i]
        }

        if (task_list !== '') {
            output += render_para(para)
            para = []

            output += '<ul class="tasklist">\n' + task_list + '</ul>\n'
            continue
        }

        if (!empty_re.test(lines[i])) para.push(lines[i])
        i += 1
    }

    output += render_para(para)
    return output
}

function render_para(para) {
    if (para.length == 0) return ''
    let inner = scrub_inline(para.join('\n'))
    return `<p>${inner}</p>\n`
}

function render_code_block(code, lang) {
    // TODO: syntax highlight
    // const data = code.split('\n').join('\n')
    return `<pre><code data-lang="${lang}">${highlight(
        code,
        lang
    )}</code></pre>`
}

function render_table(rows) {
    let output = ''
    let offset = 0

    let aligns = rows[0].map(_ => 'left')

    if (valid_table_align(rows[1])) {
        aligns = rows[1].map(col => {
            let chars = Array.from(col.trim())
            let left = chars[0] === ':'
            let right = chars[chars.length - 1] === ':'
            return right ? (left ? 'center' : 'right') : 'left'
        })

        output += '<thead>\n'
        output += render_tr(rows[0], aligns, 'th')
        output += '</thead>\n'
        offset = 2
    }

    output += '<tbody>\n'
    for (let i = offset; i < rows.length; i++) {
        output += render_tr(rows[i], aligns, 'td')
    }
    output += '</tbody>\n'

    return output
}

function valid_table_align(cols) {
    if (!cols) return false

    for (let col of cols) {
        if (/^\s*:?\s*-+\s*:?\s*$/.test(col)) continue
        return false
    }
    return true
}

// console.log(valid_table_align(['----', ' --', '------ ', ' - ']))
// console.log(valid_table_align([':-----', '------:', ':-:', ': --- :']))

function render_tr(cols, aligns, tag) {
    console.log({ tag, cols })

    let output = '<tr>\n'

    let i = 0

    while (i < cols.length) {
        let text = scrub_inline(cols[i])
        let html = '<' + tag

        const align = aligns[i]
        if (align !== 'left') html += ` align="${align}"`

        let j = i
        while (cols[j + 1] === '') j += 1
        let span = j - i + 1

        if (span > 1) {
            html += ` colspan="${span}"`
            i = j
        }
        html += '>' + text + `</${tag}>\n`
        output += html
        i += 1
    }

    output += '</tr>\n'

    return output
}
