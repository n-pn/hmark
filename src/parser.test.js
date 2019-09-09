const parser = rqeuire('./parser')

// console.log(parser.parse_special_inline('text'))
// console.log(parser.parse_special_inline('*bold*'))
// console.log(parser.parse_special_inline('text *bold* text2'))
// console.log(parser.parse_special_inline('text * bold * text2'))
console.log(parser.parse_special_inline('text *^ bold ^* text2'))
