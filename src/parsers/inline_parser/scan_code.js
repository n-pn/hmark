import { may_escape } from '../parse_utils'

export default function parse_code(str, idx) {
    let pos = idx + 1
    while (str.charAt(pos) === '`') pos++

    while (pos < str.length) {
        const char = str.charAt(pos++)
        if (char === '`' && str.charAt(pos + 1) !== '`') {
            return [str.substring(idx + 1, pos), pos]
        }
        if (char === '\\' && may_escape(str.charAt(pos + 1))) pos++
    }

    return null
}
