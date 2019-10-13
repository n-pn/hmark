const utils = require('./utils')

const scan_blocks = require('./scan_blocks')
const render_inline = require('./render_inline')

module.exports = function(input) {
    const lines = input.replace(/\r\n|\n\r|\r/g, '\n').split('\n')
    return render_blocks(lines)
}

function render_blocks(lines) {
    const blocks = scan_blocks(lines)
    return blocks.map(x => render_block_token(x)).join('\n')
}

function render_block_token(token) {
    switch (token.tag) {
        case 'nl':
            return ''

        case 'hr':
            return '<hr />'

        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            return utils.render_tag(token.tag, render_inline(token.body))

        case 'p':
            return utils.render_tag('p', render_inline(token.body))

        case 'code':
            return render_code_block(token.body, token.attrs)

        case 'table':
            return `<table>${render_table(token.rows)}</table>`

        case 'blockquote':
            return `<blockquote>${render_blocks(token.body)}</blockquote>`

        case 'ul':
        case 'ol':
            let li_html = ''
            for (let list of token.body) {
                li_html += render_blocks(list) + '\n'
            }
            return utils.render_tag(token.tag, li_html)

        case 'tl':
            let tl_html = ''

            for (let task of token.body) {
                let text = render_inline(task.text)
                let attrs = { class: 'li _uncheck' }
                if (task.done) attrs = { class: 'li _checked' }
                tl_html += utils.render_tag('div', text, attrs) + '\n'
            }
            return utils.render_tag('div', tl_html, { class: 'tl' })

        case 'custom':
            return render_custom_token(token)

        default:
            throw 'Unknown token ' + token.tag
    }
}

function render_custom_token({ name, body, attrs, short }) {
    switch (name) {
        case 'hr':
            return '<hr />'

        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            // TODO: accept some attributes?
            return utils.render_tag(name, render_inline(token), {})

        case 'img':
            const img_url = body.length > 0 ? body[0] : attrs.src
            const img_alt = attrs.alt || img_url

            const img_html = `<img src="${img_url}" alt="${img_alt}" />`
            return utils.render_tag('a', img_html, {
                class: 'img',
                rel: 'noopenner noreferrer',
            })

        case 'code':
            return render_code_block(body, attrs)

        case 'blockquote':
            return `<blockquote>${render_blocks(body)}</blockquote>`

        default:
            const e_attrs = utils.render.attrs(attrs)

            if (short) {
                return `[[${name}${e_attrs} /]]`
            } else {
                return `[[${name}${e_attrs}]]\n${body}[[/${name}]]`
            }
    }
}

function render_code_block(code, attrs) {
    // TODO: line numbers, prefix etc.
    const { value, language } = utils.highlight(code, attrs.lang)

    const lines = value.split('\n').map(x => `<div>${x}</div>\n`)
    return `<pre><code class="code-block" data-lang="${language}">${lines}</code></pre>`
}

function render_table(rows) {
    let output = ''
    let offset = 0
    let aligns = null

    if ((aligns = scan_table_align(rows[1]))) {
        output += '<thead>\n'
        output += render_row(rows[0], aligns, 'th')
        output += '</thead>\n'
        offset = 2
    } else {
        aligns = cols[0].map(_ => 'left')
    }

    output += '<tbody>\n'
    for (let i = offset; i < rows.length; i++) {
        output += render_row(rows[i], aligns, 'td')
    }
    output += '</tbody>\n'

    return output
}

function scan_table_align(cols) {
    if (!cols) return null

    let output = []

    for (let col of cols) {
        col = col.trim()

        let i = 0
        let left = col.charAt(i) === ':'
        if (left) i += 1

        let j = col.length
        let right = col.charAt(j - 1) === ':'
        if (right) j -= 1

        let text = col.substring(i, j)
        if (/[^\-]/.test(text)) return null

        let align = right ? (left ? 'center' : 'right') : 'left'
        output.push(align)
    }

    return output
}

function render_row(cols, aligns, tag = 'td') {
    let output = '<tr>\n'

    for (let i = 0; i < cols.length; i++) {
        let attrs = {}
        if (aligns[i] !== 'left') attrs.align = aligns[i]

        let span = 1
        for (; cols[i + span] === ''; span++);
        if (span > 1) {
            attrs.colspan = span
            i += span - 1
        }

        output += utils.render_tag(tag, render_inline(cols[i]), attrs)
        output += '\n'
    }

    output += '</tr>\n'

    return output
}
