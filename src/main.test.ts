import hmark from "./main";
test("works", () => {
  expect(hmark("test")).toBe(`<p>test</p>\n`);
});
