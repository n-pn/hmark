const hljs = require('highlight.js')
// import 'highlight.js/styles/tomorrow.css'

module.exports = function highlight(code, lang) {
    if (lang === 'text' || lang === 'plain-text' || lang === 'no-highlight')
        lang = 'plaintext'

    return hljs.highlight(lang, code).value
}
