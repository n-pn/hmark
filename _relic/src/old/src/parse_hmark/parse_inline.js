// backslash-escapable ascii punctuation characters
const ASCII_PUNCTS = ['!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+',
                ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@',
                '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];

// replacements for backslash-escaped ascii punctuation characters
var PUNCT_REPLACES = [];
for (var i = 0; i < ASCII_PUNCTS.length; i++) {
    var code_point = ASCII_PUNCTS[i].charCodeAt(0);
    var new_code_point = code_point + 0xF000; // transcend to private use area
    PUNCT_REPLACES[i] = String.fromCodePoint(new_code_point);
}

// replace backslash-escaped ascii punctuation characters to private use area
function ascend_punct(input) {
    var output = '';
    var index = 0;
    while (index < input.length) {
        var char = input.charAt(index++);
``
        if (char !== '\\') {
            output += char;
            continue;
        }
        char = input.charAt(index++);
        var char_index = ASCII_PUNCTS.indexOf(char);
        if (char_index === -1) {
            output += '\\' + char;
            continue;
        }
        output += PUNCT_REPLACES[char_index];
    }
    return output;
}

// convert from private use area to ascii punctuation characters
function descend_punct(input) {
    var output = '';
    for (var i = 0; i < input.length; i++) {
        var char = input.charAt(i);
        var idx = PUNCT_REPLACES.indexOf(char);
        if (idx === -1) {
            output += char;
        } else {
            output += ASCII_PUNCTS[idx];
        }
    }
    return output;
}

const INLINES = {
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

const INLINE_RE = /^(.*?)(\*\*|\'\'|__|--|\+\+|\^\^|~~|!!|%%|\$\$|``|\|\|)(\S|\S.*\S)\2(.*)$/

function parse_inline(input) {
    input = ascend_punct(input);

    var match = input.match(INLINE_RE);
    if (match) {
        var output = [];

        var before = match[1];
        if (before) output = output.concat(parse_inline(before));

        var type = INLINES[match[2]];
        var inner = match[3];

        if (type === 'ruby') {
            var ruby = inner.split(':');
            var rb = descend_punct(ruby.shift());
            var rt = descend_punct(ruby.join(':'));
            output.push({name: 'ruby', rb: rb, rt: rt});
        } else if (type === 'math' || type === 'code') {
            output.push({name: type, value: descend_punct(inner)});
        } else {
            output.push({name: type, inner: parse_inline(inner)});
        }

        var after = match[4];
        if (after) output = output.concat(parse_inline(after));

        return output;
    }

    return [{name: 'text', value: descend_punct(input)}];
}

module.exports = parse_inline;
