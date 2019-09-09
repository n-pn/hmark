function parseBlock(input) {
    input = input.replace(/\r\n|\n\r|\n|\r/g, "\n")
                 .replace(/^\n+|\n+$/, '');

    var output = [];

    // match rulers
    var match = input.match(/([\s\S]*?)^\s*={3,}.*$([\s\S]*)/m);
    if (match) {
        var before = match[1];
        if (before) output = output.concat(parseBlock(before));

        output.push({name: 'hr'});

        var after = match[2];
        if (after) output = output.concat(parseBlock(after));

        return output;
    }

    // match headings
    match = input.match(/([\s\S]*?)^\s*(#{1,6})\s*(.+)$([\s\S]*)/m)
    if (match) {
        // console.log(match);
        var before = match[1];
        if (before) output = output.concat(parseBlock(before));

        var name = 'h' + match[2].length;
        var inner = parseInline(match[3].replace(/^\s+|\s+$/g, ''));

        output.push({name: name, inner: inner});

        var after = match[4];
        if (after) output = output.concat(parseBlock(after));

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
            inner = inner.concat(parseInline(line));
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

// backslash-escapable ascii punctuation characters
const puncts = ['!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];

// replacements for backslash-escaped ascii punctuation characters
var replaces = [];
for (var i = 0; i < puncts.length; i++) {
    var codePoint = puncts[i].charCodeAt(0);
    var newCodePoint = codePoint + 0xF000; // transcend to private use area
    replaces[i] = String.fromCodePoint(newCodePoint);
}

// replace backslash-escaped ascii punctuation characters to private use area
function ascendPunct(input) {
    var output = "";
    var index = 0;
    while (index < input.length) {
        var char = input.charAt(index++);
``
        if (char !== '\\') {
            output += char;
            continue;
        }
        char = input.charAt(index++);
        var char_index = puncts.indexOf(char);
        if (char_index === -1) {
            output += '\\' + char;
            continue;
        }
        output += replaces[char_index];
    }
    return output;
}

// convert from private use area to ascii punctuation characters
function descendPunct(input) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
        var char = input.charAt(i);
        var idx = replaces.indexOf(char);
        if (idx === -1) {
            output += char;
        } else {
            output += puncts[idx];
        }
    }
    return output;
}

const inlines = {
    '**': 'strong',
    "''": 'em',
    '__': 'u',
    '--': 'del',
    '++': 'ins',
    '^^': 'sup',
    '~~': 'sub',
    '!!': 'spl',
    '%%': 'mark',
    '``': 'code',
    '||': 'ruby',
    '$$': 'math'
}

function parseInline(input) {
    // console.log(input);
    input = ascendPunct(input);

    // match inline elements
    var match = input.match(/^(.*?)(\*\*|\'\'|__|--|\+\+|\^\^|~~|!!|%%|\$\$|``|\|\|)(\S|\S.*\S)\2(.*)$/);
    if (match) {
        var output = [];

        var before = match[1];
        if (before) output = output.concat(parseInline(before));

        var type = inlines[match[2]];
        var inner = match[3];

        if (type === 'ruby') {
            var ruby = inner.split(':');
            var rb = descendPunct(ruby.shift());
            var rt = descendPunct(ruby.join(':'));
            output.push({name: 'ruby', rb: rb, rt: rt});
        } else if (type === 'math' || type === 'code') {
            output.push({name: type, value: descendPunct(inner)});
        } else {
            output.push({name: type, inner: parseInline(inner)});
        }

        var after = match[4];
        if (after) output = output.concat(parseInline(after));

        return output;
    }

    return [{name: 'text', value: descendPunct(input)}];
}

const mergeOptions = require('./merge_options');

var parser = {
    options: {},
    parse: (input, options) => {
        var options = mergeOptions(options, htmlRenderer.options);
        return parseBlock(input);
    }
};

module.exports = parser;
