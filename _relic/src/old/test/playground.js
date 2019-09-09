INPUT = `a
- b
- c
d
`

REGEX = /(\s\S*?)((^\s*[\-+].+$)+)(\s\S*?)/m

console.log(INPUT.match(REGEX))
