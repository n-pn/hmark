// require('../ext/aes.min.js');
require('../ext/katex.min.js');

function escape_html(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function render_html(token) {
    if (token instanceof Array) {
        var data = ''

        for (var tok of token) { data += render_html(tok) }

        return data
    }

    switch (token.name) {
    case 'text':
        return escape_html(token.value)

    case 'br':
    case 'hr':
        return `<${token.name}>`

    case 'p':
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
    case 'strong':
    case 'em':
    case 'u':
    case 'del':
    case 'ins':
    case 'sub':
    case 'sup':
    case 'spl':
    case 'mark':
    case 'blockquote':
    case 'ul':
    case 'li':
    case 'dl':
    case 'dt':
    case 'dd':
        return `<${token.name}>${render_html(token.inner)}</${token.name}>`

    case 'ruby':
        return `<ruby>${token.rb}<rp>(</rp><rt>${token.rt}</rt><rp>)</rp></ruby>`

    case 'code':
        return `<code>${escape_html(token.value)}</code>`

    case 'math':
        if (katex) { return `<math>${katex.renderToString(token.value)}</math>` }
        return `<math>${escape_html(token.value)}</math>`

    case 'check':
        var checked = token.checked ? ' checked' : ''
        return `<input type="checkbox"${checked} disabled>`

    case 'radio':
        var checked = token.checked ? ' checked' : ''
        return `<input type="radio"${checked} disabled>`

    case 'ol':
        var start = token.start || "1";
        return `<ol start="${start}">${render_html(token.inner, options)}</ol>`;

    case 'table':
        return render_table(token);

    case 'link':
        return render_link(token);

    case 'inline':
        return render_inline(token);

    case 'block':
        return render_block(token);

    default:
        console.log(token);
        return escape_html(token.value);
    }
}

function render_table(token) {
    return "TODO";
}

function render_link(token) {
    return "TODO";
}

function render_inline(token) {
    return "TODO";
}

function render_block(token) {
    return "TODO";
}

module.exports = (tokens) => {
    return render_html(tokens)
}
