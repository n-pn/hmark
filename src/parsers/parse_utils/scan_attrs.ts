import may_escape from "./may_escape";

export default function parse_attrs(chars: string | string[]) {
  if (typeof chars === "string") chars = Array.from(chars);

  let ret = {};

  for (let i = 0; i < chars.length; i++) {
    while (i < chars.length && chars[i] === " ") i += 1;
    if (i >= chars.length) break;

    let key = "";

    for (; i < chars.length; i++) {
      let char = chars[i];
      if (char === "=" || char === " ") break;

      if (char === "\\" && may_escape(chars[i + 1])) key += chars[++i];
      else key += char;
    }

    if (chars[i] === "=") {
      i++;
    } else {
      ret[key] = key;
      continue;
    }

    let stop = chars[i];
    if (stop === '"' || stop === "'") i++;
    else stop = " ";

    let val = "";

    for (; i < chars.length; i++) {
      const char = chars[i];
      if (char === stop) break;

      if (char === "\\" && may_escape(chars[i + 1])) val += chars[++i];
      else val += char;
    }

    ret[key] = val || key;
  }

  return ret;
}
