exports.split_once = (input, delimiter = ' ') => {
    let pos = input.indexOf(delimiter)
    let first = input.substring(0, pos)
    let second = input.substring(pos + delimiter.length)
    return [first, second]
}

exports.split_block = input => {
    return input
        .replace(/\r\n|\n\r|\r/g, '\n') // convert to `lf` unix line ending
        .split('\n')
}

exports.split_inline = input => {
    let output = []

    const chars = Array.from(input)

    for (let i = 0; i < chars.length - 1; i++) {
        let char = chars[i]
        let next = chars[i + 1]

        if (char == '\\' && may_escape(next)) {
            output.push({ c: char, v: next })
            i += 1 // skip reading next
        } else {
            output.push({ c: char, v: char })
        }
    }

    let last = chars[chars.length - 1]
    output.push({ c: last, v: last })

    return output
}

function may_escape(char) {
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
        case '\\': // escape self
            return true
        default:
            return false
    }
}
