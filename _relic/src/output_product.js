function render(data, func) {
    if (typeof func !== 'function') return;
    return func(data);
}

function escapeHTML(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderHTML(token, plugins) {
    if (token instanceof Array) {
        var data = '';
        for (var tok of token) { data += renderHTML(tok, plugins); }
        return data;
    }

    switch (token.name) {
    case 'text':
        return render(token.value, plugins[token.name]) || escapeHTML(token.value);

    case 'hr':
    case 'br':
        return render(token.name, plugins[token.name]) || `<${token.name}>`;

    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
    case 'p':
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
        return `<${token.name}>${renderHTML(token.inner, plugins)}</${token.name}>`;

    case 'ruby':
        return `<ruby>${token.rb}<rp>(</rp><rt>${token.rt}</rt><rp>)</rp></ruby>`;

    case 'code':
        return `<code>${escapeHTML(token.value)}</code>`;

    case 'math':
        if (!katex) return `<math>${escapeHTML(token.value)}</math>`;
        return `<math>${katex.renderToString(token.value)}</math>`;

    case 'task':
        var checked = token.check ? ' checked' : '';
        return `<label><input type="checkbox"${checked}>${renderHTML(token.inner, plugins)}</label>`;

    case 'ol':
        var start = token.start || "1";
        return `<ol start="${start}">${renderHTML(token.inner, plugins)}</ol>`;

    case 'table':
        return renderTable(token, plugins);

    case 'link':
        return renderLink(token, plugins);

    case 'inline':
        return renderInline(token, plugins);

    case 'block':
        return renderBlock(token, plugins);

    default:
        console.log(token);
        return escapeHTML(token.value);
    }
}

function renderTable(token, plugins) {
    return "TODO";
}

function renderLink(token, plugins) {
    return "TODO";
}

function renderInline(token, plugins) {
    return "TODO";
}

function renderBlock(token) {
    return "TODO";
}

export { renderHTML }
