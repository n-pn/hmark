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

function scrub_block(lines) {
    let output = ''
    let para = []
    let i = 0

    while (i < lines.length) {
        let line = lines[i]

        if (empty_re.test(line)) {
            output += render_para(para)
            para = []

            i += 1
            continue
        }

        // match rulers
        if ((match = line.match(ruler_re))) {
            output += render_para(para)
            para = []

            output += `<hr />\n`

            i += 1
            continue
        }

        // match heading level 1-6
        if ((match = line.match(headings_re))) {
            output += render_para(para)
            para = []

            let tag = 'h' + match[1].length
            let inner = scrub_inline(match[2])
            output += `<${tag}>${inner}</${tag}>\n`

            i += 1
            continue
        }

        // match code block
        if ((match = line.match(codeblock_begin_re))) {
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
        if ((match = line.match(blockquote_re))) {
            output += render_para(para)
            para = []

            // console.log({ blockquote: i })

            let acc = [match[1]]
            let j = i + 1

            while (j < lines.length) {
                line = lines[j]
                if ((match = line.match(blockquote_re))) {
                    acc.push(match[1])
                    j += 1
                } else break
            }

            console.log({ blockquote: acc })

            output += `<blockquote>${scrub_block(acc)}</blockquote>\n`
            i = j
            // continue
        }

        // match ordered lists
        let ordered_list = ''

        while (i < lines.length) {
            match = line.match(ordered_list_re)
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
            line = lines[i]
            // console.log({ acc })
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
            match = line.match(unordered_list_re)
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
            line = lines[i]
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
            match = line.match(tasklist_re)
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

        para.push(line)
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
