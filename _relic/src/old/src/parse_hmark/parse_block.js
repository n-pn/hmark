const parse_inline = require('./parse_inline')

function join_blocks(before, content, after) {
    var output = []

    if (before) { output = output.concat(parse_block(before)) }
    output.push(content)
    if (after) { output = output.concat(parse_block(after)) }

    return output
}

function parse_block(input) {
    // convert windows and mac os newlines to unix lf characters
    input = input.replace(/\r\n|\n\r|\n|\r/g, '\n')

    // remove leading and trailing newlines
    input = input.replace(/^\n+|\n+$/, '')

    var output = []

    // match rulers
    var match = input.match(/([\s\S]*?)^\s*={3,}.*$([\s\S]*)/m)
    if (match) {
        var before = match[1]
        var after = match[2]
        var content = {name: 'hr'}
        return join_blocks(before, content, after)
    }

    // match headings
    match = input.match(/([\s\S]*?)^\s*(#{1,6})\s*(.+)$([\s\S]*)/m)
    if (match) {
        // console.log(match);
        var before = match[1];
        if (before) output = output.concat(parse_block(before));

        var name = 'h' + match[2].length;
        var inner = parse_inline(match[3].replace(/^\s+|\s+$/g, ''));

        output.push({name: name, inner: inner});

        var after = match[4];
        if (after) output = output.concat(parse_block(after));

        return output;
    }


    // match paragraphs
    var paras = input.replace(/^\s*$/m, '').split(/\n{2,}/m);
    for (var para of paras) {
        if (para === "") {
            continue;
        }
        var lines = para.split("\n");
        var inner = [];
        for (var line of lines) {
            if (line === "") {
                continue;
            }
            inner = inner.concat(parse_inline(line));
            inner.push({name: 'br'});
        }

        // remove last `br` tag
        if (inner.length > 0 && inner[inner.length-1].name === 'br') {
            inner.pop();
        }

        output.push({name: 'p', inner: inner});
    }

    return output;
}

module.exports = parse_block;
