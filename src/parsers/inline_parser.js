import { tokenize } from "./parse_utils";

export default function parse_inline(input) {
  if (typeof input === "string") input = tokenize(input);
  return do_parse(input, opts);
}

const parsers = {
  "`": { name: "code", call: require("./inline_parser/scan_code") },
  "<": { name: "link", call: require("./inline_parser/parse_link") },
  "!": { name: "image", call: require("./inline_parser/parse_image") },
  ":": { name: "emoji", call: require("./inline_parser/parse_emoji") },
  "[": { name: "custom", call: require("./inline_parser/parse_custom") },
  "*": { name: "emphasis", call: require("./inline_parser/parse_emphasis") },
  _: { name: "emphasis", call: require("./inline_parser/parse_emphasis") }
};

function do_parse(input, opts = {}) {
  let output = [];
  let match = null;

  for (let i = 0; i < input.length; i++) {
    let parser = parsers[input[i][0]];

    if (parser) {
      if ((match = parser.call(input, i))) {
        if (parser.name === "emphasis") {
          match.output.body = do_parse(match.output.body, opts);
        }
        output.push(match.output);
        i = match.offset;
        continue;
      }
    }

    let last = output[output.length - 1] || {};
    let curr = input[i];
    if (last.tag === "text") last.body.push(curr);
    else output.push({ tag: "text", body: [curr] });
  }

  return output;
}
