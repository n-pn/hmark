export default function may_escape(char: string) {
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
