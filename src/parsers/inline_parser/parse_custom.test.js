const parse_custom = require("./parse_custom");

const { tokenize } = require("../parse_utils");

function parse(input) {
  const tokens = tokenize(input);
  return parse_custom(tokens, 0);
}

test("parse shorthand with no attribute", () => {
  const inp = "[tag/]";
  const out = {
    output: {
      tag: "inline",
      name: "tag",
      body: [],
      attrs: {},
      short: true
    },
    offset: inp.length - 1
  };

  expect(parse(inp)).toEqual(out);
});

test("parse empty tag with no attribute", () => {
  const inp = "[tag][/tag]";
  const out = {
    output: {
      tag: "inline",
      name: "tag",
      body: [],
      attrs: {},
      short: false
    },
    offset: inp.length - 1
  };

  expect(parse(inp)).toEqual(out);
});

test("parse normal tag with no attribute", () => {
  const inp = "[tag]body[/tag]";
  const out = {
    output: {
      tag: "inline",
      name: "tag",
      body: Array.from("body").map(x => [x, x]),
      attrs: {},
      short: false
    },
    offset: inp.length - 1
  };

  expect(parse(inp)).toEqual(out);
});

test("parse shorthand with attributes", () => {
  const inp = "[tag a=a b=\"b\" c='c' d /]";
  const out = {
    output: {
      tag: "inline",
      name: "tag",
      body: [],
      attrs: {
        a: "a",
        b: "b",
        c: "c",
        d: true
      },
      short: true
    },
    offset: inp.length - 1
  };

  expect(parse(inp)).toEqual(out);
});

test("parse normal tag with attributes", () => {
  const inp = "[tag a=a b=\"b\" c='c' d]body[/tag]";
  const out = {
    output: {
      tag: "inline",
      name: "tag",
      body: Array.from("body").map(x => [x, x]),
      attrs: {
        a: "a",
        b: "b",
        c: "c",
        d: true
      },
      short: false
    },
    offset: inp.length - 1
  };

  expect(parse(inp)).toEqual(out);
});
