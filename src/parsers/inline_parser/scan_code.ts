import may_escape from '../parse_utils/may_escape'

export default function parse_code(inp: Array<string>, idx: number = 0) {
    let pos = idx + 1
    while (inp[pos] === '`') pos++

    while (pos < inp.length) {
        const char = inp[pos++]
        if (char === '`' && inp[pos + 1] !== '`') {
            return [inp.slice(idx + 1, pos), pos]
        }
        if (char === '\\' && may_escape(inp[pos + 1])) pos++
    }

    return null
}
