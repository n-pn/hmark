const utils = require('../utils')

const parse_block = require('./hmark/parse_block')
const parse_inline = require('./hmark/parse_inline')
const render_code = require('./hmark/render_code')

class Hmark {
    constructor(options = {}) {
        this.options = options
        this.render_code = render_code
    }

    parse_block(lines) {
        parse_block(lines, this.options)
    }

    parse_inline(chars) {
        parse_inline(chars, this.options)
    }

    render(input) {
        const lines = utils.split_block(input)
        const tokens = this.parse_block(lines)
        return tokens.map(x => render_block_token(x)).join('\n')
    }

    render_inline(input) {
        const chars = utils.split_inline(input)
        const tokens = this.parse_inline(chars)
        return tokens.map(x => this.render_inline_token(x)).join('')
    }

    render_block_token(token) {
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
                return this.render_tag(
                    token.tag,
                    this.render_inline(token.body)
                )

            case 'p':
                return this.render_tag('p', this.render_inline(token.body))

            case 'table':
                return this.render_table(token.rows)

            case 'blockquote':
                return `<blockquote></blockquote>`

            case 'codeblock':
                return this.render_code_block(token.body, { lang: token.lang })

            case 'block':
                switch (token.name) {
                    case 'hr':
                        return '<hr />'

                    case 'h1':
                    case 'h2':
                    case 'h3':
                    case 'h4':
                    case 'h5':
                    case 'h6':
                        return this.render_tag(
                            token.name,
                            this.render_inline(token.body)
                        )

                    case 'code':
                        return this.render_code_block(token.body, token.attrs)

                    default:
                        return `[[${t.name}]]\n${t.body}[[]]`
                }

            default:
                throw 'Unknown token'
        }
    }

    render_code_block(code, attrs) {
        // TODO: line numbers, prefix etc.
        const { value, language } = this.render_code(code, attrs.lang)
        return `<pre><code data-lang="${language}">${value}</code></pre>`
    }

    render_inline_token(token) {
        switch (token.tag) {
            case 'text':
                return utils.escape_text(token.value)

            case 'code':
                return this.render_tag('code', utils.escape_text(token.value))

            case 'strong':
            case 'em':
                let x_body = token.body
                    .map(x => this.render_inline_token(x))
                    .join('')

                return this.render_tag(token.tag, x_body)

            case 'inline':
                switch (token.name) {
                    case 'code':
                        const { value, language } = this.render_code(
                            token.body,
                            token.attrs.lang
                        )
                        return this.render_tag('code', value, {
                            'data-lang': language,
                        })

                    case 'kbd':
                    case 'var':
                    case 'output':
                        return this.render_tag(
                            token.name,
                            utils.escape_text(token.value)
                        )

                    case 'strong':
                    case 'em':
                    case 'q':
                    case 'sup':
                    case 'sub':
                    case 'ins':
                    case 'del':
                    case 'mark':
                        let il_body = this.render_inline(token.body)
                        return this.render_tag(token.name, il_body)

                    default:
                        let xx_attrs = ''

                        if (token.attrs !== {}) {
                            xx_attrs = ' ' + this.render_attrs(token.attrs)
                        }

                        if (token.short) {
                            return `[${t.name}${xx_attrs}/]`
                        } else {
                            let xx_body = utils.escape_text(token.body)
                            return `[${t.name}${xx_attrs}]${xx_body}[/${t.name}]`
                        }
                }

            // let attrs = t.attrs.map(
            //     ([k, v]) => `${k}="${utils.escape_attr(v)}"`
            // )
            // let body = utils.escape_text(t.body)
            //

            default:
                throw 'Unknown token'
        }
    }

    render_table(rows) {
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

    valid_table_align(cols) {
        if (!cols) return false

        for (let col of cols) {
            if (/^\s*:?\s*-+\s*:?\s*$/.test(col)) continue
            return false
        }
        return true
    }

    render_tr(cols, aligns, tag) {
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

    render_tag(name, body, attrs = {}) {
        let html = `<${name}`
        if (attrs !== {}) html += ' ' + this.render_attrs(attrs)
        html += `>${body}</${name}>`
        return html
    }

    render_attrs(attrs) {
        const tokens = Object.entries(attrs).map(([k, v]) => {
            let tk = utils.escape_attr(k)
            let tv = utils.escape_attr(v)
            return `${tk}="${tv}"`
        })

        return tokens.join(' ')
    }
}

module.exports = Hmark

// input = `
// [[code lang="hmark"]]

// = heading
// text
// == heading
// === heading
// text
// [[/code]]
// text
// \`\`\`ruby
// puts "Hello world"
// \`\`\`\`

// |table| table| table|
// |table| table|

// | table
// text

// [[meta name=tags values="1, 2, 3" flag /]]
// `
// console.log(parse(input))
