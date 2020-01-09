import scanner from './scan_emoji'

function assert_eq(inp: string, out: any) {
    const chars = Array.from(inp)
    if (out) out[0] = Array.from(out[0])
    const res = scanner(chars, 0)
    expect(res).toEqual(out)
}

test('detects valid emojis', () => {
    assert_eq(':x:', ['x', 2])
    assert_eq(':smile:', ['smile', 6])
})

test('ignores invalid emoji', () => {
    assert_eq('::', null)
    assert_eq(': :', null)
    assert_eq(':x :', null)
    assert_eq(': x:', null)
    assert_eq(':x x:', null)
})
