function escape_html(text) {
  return text.replace(/</g, '&lt;').replace(/>/, '&gt;')
}

function encode_href(link) {
  return encodeURI(link)
}

module.exports = { escape_html, encode_href }
