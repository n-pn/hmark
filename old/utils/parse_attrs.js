const split = require("./split");

exports.block_attrs = input => {
  const chars = split.split_inline(input);
  return exports.inline_attrs(chars);
};

exports.inline_attrs = chars => {
  let attrs = {};
  let i = 0;

  while (i < chars.length) {
    while (chars[i].c === " ") i += 1;
    if (i >= chars.length) break;

    let key = "";
    let val = "";

    while (i < chars.length) {
      if (chars[i].c === "=") break;
      if (chars[i].c === " ") break;

      key += chars[i].v;
      i += 1;
    }

    if (i >= chars.length) {
      attrs[key.trim()] = true;
      break;
    } else if (chars[i] === " ") {
      attrs[key.trim()] = true;
      i += 1;
      continue;
    } else {
      i += 1; // skip '='
    }

    let stop = " ";
    if (chars[i].c === '"') {
      stop = '"';
      i += 1;
    } else if (chars[i].c === "'") {
      stop = "'";
      i += 1;
    }

    while (i < chars.length && chars[i].c !== stop) {
      val += chars[i].v;
      i += 1;
    }

    attrs[key.trim()] = val;
    i += 1;
  }

  return attrs;
};
