# TODO

## Planning

- [ ] change italic from `/xyz/` to `_xyz_` ?
- [ ] export html
- [ ] support AST
- [ ] syntax highlight from AST
- [ ] allow writing custom renderers

## Implementing

- [x] `*bold*`
- [x] `/italic/`
- [x] `` `code` ``
- [ ] `<link>`
- [ ] `!<image>`

- [x] ruler `---`
- [x] heading `=`, `==`, `===`
- [x] blockquote `>`
- [ ] todo `[ ]` and `[x]`
- [ ] unordered list `-`
- [ ] ordered list `1.` or `+`
- [ ] code block ` ``` `
- [ ] table `|a|b|`

- [ ] custom inline tags, e.g. `[tag]content[/tag]`
- [ ] custom block tags, e.g.
  ```
  [[tag:arg1:arg2/opt1:val1:val2/opt2:val3/val4]]
  body
  [[/tag]]
  ```
