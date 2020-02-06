const utils = require("./utils");
const scan_inline = require("./scan_inline");

module.exports = function(line) {
  const chars = utils.split.split_inline(line);
  const tokens = scan_inline(chars);

  return tokens.map(token => render_inline_token(token)).join("");
};

function render_inline_token(token) {
  switch (token.tag) {
    case "text":
      return utils.render.text(token.value);

    case "code":
      return utils.render.tag("code", utils.render.text(token.value));

    case "strong":
    case "em":
      let x_body = token.body.map(x => render_inline_token(x)).join("");

      return utils.render.tag(token.tag, x_body);

    case "inline":
      return render_custom_token(token);

    // let attrs = t.attrs.map(
    //     ([k, v]) => `${k}="${utils.escape_attr(v)}"`
    // )
    // let body = utils.render.text(t.body)
    //

    default:
      throw "Unknown inline token " + token.tag;
  }
}

function render_custom_token(token) {
  switch (token.name) {
    case "code":
      const { value, language } = this.render_code(
        token.body,
        token.attrs.lang
      );
      return utils.render.tag("code", value, {
        "data-lang": language
      });

    case "kbd":
    case "var":
    case "output":
      return utils.render.tag(token.name, utils.render.text(token.value));

    case "strong":
    case "em":
    case "q":
    case "sup":
    case "sub":
    case "ins":
    case "del":
    case "mark":
      let il_body = this.render_inline(token.body);
      return utils.render.tag(token.name, il_body);

    default:
      let xx_attrs = "";

      if (token.attrs !== {}) {
        xx_attrs = " " + this.render_attrs(token.attrs);
      }

      if (token.short) {
        return `[${t.name}${xx_attrs}/]`;
      } else {
        let xx_body = utils.render.text(token.body);
        return `[${t.name}${xx_attrs}]${xx_body}[/${t.name}]`;
      }
  }
}
