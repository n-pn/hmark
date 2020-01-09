export function parse_attrs(input) {
    if (typeof input === 'string') input = exports.tokenize(input)

    let output = {}

    for (let i = 0; i < input.length; i++) {
        while (i < input.length && input[i][0] === ' ') i += 1
        if (i >= input.length) break

        let key = ''

        for (; i < input.length; i++) {
            let mark = input[i][0]
            if (mark === '=' || mark === ' ') break
            key += input[i][1]
        }

        if (i + 1 >= input.length) {
            output[key] = true
            break
        } else if (input[i][0] === ' ') {
            output[key] = true
            continue
        } else {
            i += 1 // skip '='
        }

        let stop_char = input[i][0]
        if (stop_char === '"' || stop_char === "'") i += 1
        else stop_char = ' '

        let value = ''
        for (; i < input.length && input[i][0] !== stop_char; i++) {
            value += input[i][1]
        }

        output[key] = value === '' ? true : value
    }

    return output
}

export function tokenize(input) {
    const chars = Array.from(input)

    let output = []

    for (i = 0; i < chars.length; i++) {
        let char = chars[i]
        let next = chars[i + 1]

        if (char === '\\' && may_escape(next)) {
            output.push([char, next])
            i += 1 // skip reading next
        } else {
            output.push([char, char])
        }
    }

    return output
}

export function may_escape(char) {
    switch (char) {
        // case '~':
        // case '$':
        // case '%':
        // case '&':
        // case ',':
        // case '.':
        // case ';':
        // case '?':
        // case '|':
        case '"': // double quote
        case "'": // single quote
        case '#': // hash tag
        case '@': // at tag
        case '[': // task list, link text, custom tag
        case ']': // close task list or link text, close custom tag
        case '!': // mark link is image
        case '(': // open link text
        case ')': // close link text
        case '<': // before text link
        case '>': // block quote, close text link
        case '=': // heading
        case '+': // auto ordered list
        case '-': // unordered list, rulers
        case '`': // code
        case '*': // bold
        case '_': // italic
        case ':': // emoji
        case ' ': // escape whitespace
        case '/': // escape tag terminal
        case '\\': // escape self
            return true
        default:
            return false
    }
}
