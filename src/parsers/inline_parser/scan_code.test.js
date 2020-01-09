import scan_code from './scan_code'

function assert_eq(inp, out) {
    inp = Array.from(inp)
    if (out) out[0] = Array.from(out[0])
    const res = scan_code(inp, 0)
    expect(res).toEqual(out)
}

test('find valid code spans', () => {
    assert_eq('`x`', ['x', 2])
    assert_eq('`x` ', ['x', 2])
    assert_eq('`xy`', ['xy', 3])
    assert_eq('`xy`x', ['xy', 3])
    assert_eq('`x y`', ['x y', 4])
    assert_eq('`x y`z', ['x y', 4])
    assert_eq('`\\``', ['\\`', 3])
})

test('skip invalid code spans', () => {
    assert_eq('``', null)
    assert_eq('`````', null)
    assert_eq('`````abc', null)
})
