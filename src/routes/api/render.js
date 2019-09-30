import hmark from '../../lib/hmark'

export function post(req, res) {
    const { data } = req.body
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ html: hmark(data) }))
}
