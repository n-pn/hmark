const parseInline = require('./parse_inline_2')



function parseBlock(input) {
    var lines = input.replace(/\r\n|\n\r|\n|\r/g, '\n').split('\n');

    var index = 0, output = [];

    while (index < lines.length) {
        var line = lines[index++], match;

        // scan block extensions
        const BLOCK_RE = /\s{0,3}(`{3,})\s*(.+)\s*/;
        match = line.match(BLOCK_RE);
        if (match) {
            var mark = match[1];
            var blockEndRe = new RegExp(`^\\s*${mark}\\s*$`);

            var option = match[2];
            var [type, attr] = option ? option.split(':') : ['', ''];

            var token = {name: 'block', type: type, attr: attr, mark: mark, raw: line, inner: ''};

            while (index < lines.length) {
                line = lines[index];
                token.raw += '\n' + line;

                if (line.match(blockEndRe)) break;

                token.inner += '\n' + line;
                index++;
            }

            output.push(token);
            continue;
        }

        // scan unordered lists
        const UNORDERED_RE = /^\s{0,3}[\-+]\s+(.+)$/;
        const INDENTED_RE = /(\t|\s{4})(.+)/;
        const BLANK_RE = /^\s*$/;

        match = line.match(UNORDERED_RE)
        if (match) {
            var token = {name: 'ul', type: 'list', raw: line, inner: [match[1]]};

            while (index < lines.length) {
                line = lines[index++];
                token.raw += '\n' + line;

                match = line.match(UNORDERED_RE);
                if (match) {
                    token.inner.push(match[1]);
                    continue;
                }

                match = line.match(INDENTED_RE);
                if (match) {
                    token.inner[token.inner.length - 1] += '\n' + match[1];
                    continue;
                }

                if (line.match(BLANK_RE)) continue;
                break;
            }

            continue;
        }

        // scan blockquotes
        const BLOCKQUOTE_RE = /^\s{0,3}>(.+)$/;
        match = line.match(BLOCKQUOTE_RE);
        if (match) {
            var token = {name: 'blockquote', raw: line, inner: match[1]}

            while (index < token.length) {
                line = lines[index];
                match = line.match(BLOCKQUOTE_RE);
                if (!match) break;

                token.raw += '\n' + line;
                token.inner += '\n' + match[1];
                index++;
            }

            output.push(token);
            continue;
        }

        // scan rulers
        const RULER_RE = /^\s{0,3}={3,}.*$/;
        if (line.match(RULER_RE)) {
            output.push({name: 'br', raw: line});
            continue;
        }

        // scan headings
        const HEADING_RE = /^\s{0,3}*(#{1,6})\s*(.+)$/;
        match = line.match(HEADING_RE);
        if (match) {
            var name = 'h' + match[1].length;
            var inner = match[2];
            var token = {name: name, type: 'heading', inner: match[2], raw: line};
        }



    // // match paragraphs
    // var paras = input.replace(/^\s*$/m, '').split(/\n{2,}/m);
    // for (var para of paras) {
    //     if (para === "") {
    //         continue;
    //     }
    //     var lines = para.split("\n");
    //     var inner = [];
    //     for (var line of lines) {
    //         if (line === "") {
    //             continue;
    //         }
    //         inner = inner.concat(parse_inline(line));
    //         inner.push({name: 'br'});
    //     }

    //     // remove last `br` name
    //     if (inner.length > 0 && inner[inner.length-1].name === 'br') {
    //         inner.pop();
    //     }

    //     output.push({name: 'p', inner: inner});
    }

    return output;
}



module.exports = parseBlock;
