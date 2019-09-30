import hmark from '../../lib/hmark'

export function post(req, res) {
    const { data } = req.body

    console.log({ render: data.length })
    console.time('rendering')
    const html = hmark(data)
    console.timeEnd('rendering')

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ html }))
}
