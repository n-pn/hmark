const { parse_attrs } = require("../parse_utils");

module.exports = function(input, index = 0) {
  const N = input.length;

  let offset = index;
  for (; offset < N && input[offset][0] !== "]"; offset++);
  if (offset >= N) return null;

  let short = false;
  if (input[offset - 1][0] === "/") {
    short = true;
    offset -= 1;
  }

  let name = [];
  let attr = [];

  let i = index + 1;
  for (; i < offset && is_valid_name(input[i][0]); i++) {
    name.push(input[i][0]);
  }
  for (; i < offset; i++) attr.push(input[i]);

  let output = {
    tag: "inline",
    name: name.join(""),
    body: [],
    attrs: parse_attrs(attr),
    short: false
  };

  if (short) {
    output.short = true;
    return { output: output, offset: offset + 1 };
  }

  for (offset = offset + 1; offset < N; offset++) {
    if (match_closing(input, offset, name)) break;
    output.body.push(input[offset]);
  }

  if (offset >= N) return null;

  return { output, offset: offset + name.length + 2 };
};

function is_valid_name(char) {
  return /[\w\-]/.test(char);
}

function match_closing(input, i, name) {
  const M = i + name.length + 2;

  if (M >= input.length) return false;

  if (input[i][0] !== "[") return false;
  if (input[M][0] !== "]") return false;
  if (input[i + 1][0] !== "/") return false;

  for (let j = i + 2; j < M; j++) {
    if (input[j][0] !== name[j - i - 2]) return false;
  }

  return true;
}

// let input
// input = Array.from('[/x]').map(x => [x, x])
// console.log(match_closing(input, 0, ['x']))

// input = Array.from('[/xy]').map(x => [x, x])
// console.log(match_closing(input, 0, ['x', 'y']))
// console.log(match_closing(input, 1, ['x', 'y']))
// console.log(match_closing(input, 0, ['x']))
// console.log(match_closing(input, 0, ['y']))
