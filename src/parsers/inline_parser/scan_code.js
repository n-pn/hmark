import { may_escape } from '../parse_utils'

export default function parse_code(str, idx) {
    while (str.charAt(idx) === '`') idx++

    while (idx < str.length) {
        const char = str.charAt(idx++)
        if (char === '`' && str.charAt(idx + 1) !== '`') return idx
        if (char === '\\' && may_escape(str.charAt(idx + 1))) idx++
    }

    return -1
}
