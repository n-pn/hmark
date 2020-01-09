import may_escape from '../parse_utils/may_escape'

export default function scan_link(chars: string[], index: number = 0) {
    if (index + 5 > chars.length) return null // minimal valid chars is <a.x>

    let caret = index + 1

    for (; caret < chars.length; caret++) {
        const char = chars[caret]
        if (char === '>') break
        if (char === '\\' && may_escape(chars[caret + 1])) caret++
    }

    if (caret >= chars.length) return null

    const inner = chars.slice(index + 1, caret)
    if (is_html_tag(inner.join(''))) return null

    // scan for alternative link body
    if (chars[caret] === '(') {
        for (let caret2 = caret + 1; caret2 < chars.length; caret2++) {
            const char = chars[caret2]
            if (char === ')') return [caret2]
            if (char === '\\' && may_escape(chars[caret + 1])) caret++
        }
    }

    return [inner, caret]
}

// const URL_RE = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-\w()@:%\+.~#?&//=]*)/

function is_html_tag(href) {
    if (href.includes(' ')) return true
    if (href === 'localhost') return false
    return /^\/?\w+$/.test(href)
}
