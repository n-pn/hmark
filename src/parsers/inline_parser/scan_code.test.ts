import scanner from './scan_code'

function assert_eq(inp: string, out: any) {
    const chars = Array.from(inp)
    if (out) out[0] = Array.from(out[0])
    const res = scanner(chars, 0)
    expect(res).toEqual(out)
}

test('detects valid code spans', () => {
    assert_eq('`\\*`', ['\\*', 3])
    assert_eq('`\\``', ['\\`', 3])
    assert_eq('`x`', ['x', 2])
    assert_eq('`x` ', ['x', 2])
    assert_eq('`xy`', ['xy', 3])
    assert_eq('`xy`x', ['xy', 3])
    assert_eq('`x y`', ['x y', 4])
    assert_eq('`x y`z', ['x y', 4])
})

test('ignores invalid code spans', () => {
    assert_eq('``', null)
    assert_eq('`````', null)
    assert_eq('`````abc', null)
})
