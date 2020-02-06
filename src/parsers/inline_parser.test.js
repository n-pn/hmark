const parse_inline = require("./parse_inline");

function body_for(str) {
  return Array.from(str).map(x => [x, x]);
}

test("parse texts", () => {
  const inp = "ab c";
  const out = [
    {
      tag: "text",
      body: body_for("ab c")
    }
  ];
  expect(parse_inline(inp)).toEqual(out);
});

test("turn off parsing", () => {
  const inp = "`ab c` def";
  const out = [
    {
      tag: "text",
      body: body_for("`ab c` def")
    }
  ];
  expect(parse_inline(inp, { code: false })).toEqual(out);
});

test("mix text with tags", () => {
  const inp = "a `b` c  :d:";
  const out = [
    {
      tag: "text",
      body: body_for("a ")
    },
    {
      tag: "code",
      body: body_for("b")
    },
    {
      tag: "text",
      body: body_for(" c  ")
    },
    {
      tag: "emoji",
      body: body_for("d")
    }
  ];
  expect(parse_inline(inp)).toEqual(out);
});

test("inline custom tags", () => {
  const inp = "a [b]`c`[/b] [d d/]";
  const out = [
    {
      tag: "text",
      body: body_for("a ")
    },
    {
      tag: "inline",
      name: "b",
      body: body_for("`c`"),
      attrs: {},
      short: false
    },
    {
      tag: "text",
      body: body_for(" ")
    },
    {
      tag: "inline",
      name: "d",
      body: [],
      attrs: { d: true },
      short: true
    }
  ];
  expect(parse_inline(inp)).toEqual(out);
});

test("nested emphasis", () => {
  const inp = "a *b _c `d`_*";
  const out = [
    {
      tag: "text",
      body: body_for("a ")
    },
    {
      tag: "strong",
      body: [
        {
          tag: "text",
          body: body_for("b ")
        },
        {
          tag: "em",
          body: [
            {
              tag: "text",
              body: body_for("c ")
            },
            {
              tag: "code",
              body: body_for("d")
            }
          ]
        }
      ]
    }
  ];
  expect(parse_inline(inp)).toEqual(out);
});
