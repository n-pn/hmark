import may_escape from '../parse_utils/may_escape'

export default function scan_emoji(chars: string[], index: number = 0) {
    let caret = index + 1

    for (; caret < chars.length; caret++) {
        const char = chars[caret]
        if (char === ':' && caret - index > 1) {
            return [chars.slice(index + 1, caret), caret]
        }

        if (!is_letter(char)) break
        if (char === '\\' && may_escape(chars[caret + 1])) caret++
    }

    return null
}

const letter_re = /[\w]/
function is_letter(char) {
    return letter_re.test(char)
}
