import may_escape from "../parse_utils/may_escape";

export default function scanner(chars: string[], index: number = 0) {
  let caret = index + 1;
  while (chars[caret] === "`") caret++;

  for (; caret < chars.length; caret++) {
    const char = chars[caret];
    if (char === "`" && chars[caret + 1] !== "`") {
      return [caret, chars.slice(index + 1, caret)];
    }

    if (char === "\\" && may_escape(chars[caret + 1])) caret++;
  }

  return null;
}
