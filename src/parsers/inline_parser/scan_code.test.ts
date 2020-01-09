import scanner from './scan_code'

function expect_eq(inp: string, [caret, value]: [number, string]) {
    expect(scanner(Array.from(inp))).toEqual([caret, Array.from(value)])
}

function expect_null(inp: string) {
    expect(scanner(Array.from(inp))).toBeNull()
}

test('detects valid code spans', () => {
    expect_eq('`\\*`', [3, '\\*'])
    expect_eq('`\\``', [3, '\\`'])
    expect_eq('`x`', [2, 'x'])
    expect_eq('`x` ', [2, 'x'])
    expect_eq('`xy`', [3, 'xy'])
    expect_eq('`xy`x', [3, 'xy'])
    expect_eq('`x y`', [4, 'x y'])
    expect_eq('`x y`z', [4, 'x y'])
})

test('ignores invalid code spans', () => {
    expect_null('``')
    expect_null('`````')
    expect_null('`````abc')
})
