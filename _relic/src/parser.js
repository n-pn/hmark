module.exports = (input, marks) => {
    scanBlockExtension(input, marks)
}

function scanBlockExtension(input, marks) {
    const regex = new RegExp(`([^]*?)\\[\\[(${marks.join('|')})(.*?)\\]\\]([^]*?)\\[\\[\\/\\2\\]\\]([^]*)`, 'm')
    const match = regex.exec(input)

    if (!match) return scanBlockShorthand(input)

    const [_, lead, mark, opts, body, trail] = match
    return [scanBlockShorthand(lead), {mark: `[[${mark}]]`, opts, body}, scanBlockShorthand(trail)]
}

function scanBlockShorthand(input) {
    return {mark: 'none', opts: {}, body: input}
}

function splitOptions(opts) {
    const regex = /(\w+?)=('|")(.+?)\2/g
    var res = {}, match

    while (match = regex.exec(opts)) {
        var key = match[1], val = match[3]
        res[key] = val
    }

    return res
}

console.log(splitOptions(` opt1="1234"   x  opt2='12345 678'   `))

// const input = `  [[tag opt1="1234" opt2='12345']]
// line1
// line2
// line3
//  [[/tag]]
// [[/tag]]
// `

// console.log(scanBlockExtension(input, ['tag']))
