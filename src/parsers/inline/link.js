module.exports = function(input, offset = 0) {
    if (offset + 5 > input.length) return null // minimal valid input is <a.x>

    const output = {
        tag: 'link',
        href: '',
        body: [],
    }

    for (offset = offset + 1; offset < input.length; offset++) {
        if (input[offset][0] === '>') break
        output.href += input[offset][1]
        output.body.push(input[offset])
    }

    if (offset >= input.length) return null
    if (is_html_tag(output.href)) return null

    // scan for alternative link body
    let index = offset + 1

    if (index < input.length && input[index][0] === '(') {
        let body = []

        for (index = index + 1; index < input.length; index++) {
            if (input[index][0] === ')') break
            body.push(input[index])
        }

        if (index < input.length) {
            output.body = body
            offset = index
        }
    }

    return { output, offset }
}

// const URL_RE = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-\w()@:%\+.~#?&//=]*)/

function is_html_tag(href) {
    if (href.includes(' ')) return true
    if (href === 'localhost') return false
    return /^\/?\w+$/.test(href)
}
