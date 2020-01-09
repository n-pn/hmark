exports.text = input => {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br />\n')
}

exports.attr = input => {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

exports.tag = (tag, body, attrs = {}) => {
    return `<${tag}${exports.attrs(attrs)}>${body}</${tag}>`
}

exports.attrs = attrs => {
    if (!attrs || attrs === {}) return ''

    let output = ''
    for (let [k, v] of Object.entries(attrs)) output += ` ${k}="${v}"`
    return output
}
