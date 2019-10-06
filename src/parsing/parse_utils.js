function is_blank(char) {
    return char == '' || char == ' '
}

function parse_attrs(attrs) {
    let res = {}

    // TODO: handle `"` and `'`

    res = attrs.split(' ').map(x => {
        let [key, val] = x.split('=')
        res[key] = val
    })

    return res
}

function split_once(input, delimiter = ' ') {
    let pos = input.indexOf(delimiter)
    let first = trim.substring(0, pos)
    let second = trim.substring(pos + delimiter.length)
    return [first, second]
}
