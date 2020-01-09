import scanner from './scan_emoji'

function expect_eq(inp: string, [caret, value]: [number, string]) {
    expect(scanner(Array.from(inp))).toEqual([caret, Array.from(value)])
}

function expect_null(inp: string) {
    expect(scanner(Array.from(inp))).toBeNull()
}

test('detects valid emojis', () => {
    expect_eq(':x:', [2, 'x'])
    expect_eq(':smile:', [6, 'smile'])
})

test('ignores invalid emoji', () => {
    expect_null('::')
    expect_null(': :')
    expect_null(':x :')
    expect_null(': x:')
    expect_null(':x x:')
})
