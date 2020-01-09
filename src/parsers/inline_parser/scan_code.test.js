import scan_code from './scan_code'

function assert_eq(str, pos) {
    const chars = Array.from(str)
    const idx = scan_code(chars, 0)
    expect(idx).toEqual(pos)
}

test('test valid code spans', () => {
    assert_eq('`x`', 2)
    assert_eq('`x` ', 2)
    assert_eq('`xy`', 3)
    assert_eq('`xy`x', 3)\
    assert_eq('`x y`', 4)
    assert_eq('`x y`', 4)
    assert_eq('`\\``', 3)
})

test('test invalid code spans', () => {
    assert_eq('``', -1)
    assert_eq('`````', -1)
    assert_eq('`````abc', -1)
})
