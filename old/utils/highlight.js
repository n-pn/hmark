const hljs = require("highlight.js");
// import 'highlight.js/styles/tomorrow.css'

module.exports = (code, lang) => {
  try {
    return hljs.highlight(lang, code);
  } catch {
    return hljs.highlight("plaintext", code);
  }
};
