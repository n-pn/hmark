import fs from 'fs'
import path from 'path'

export function get(req, res) {
  const { name } = req.query

  console.log({ example: name })

  const file = path.join('src', 'routes', '_examples', name + '.hm')

  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file).toString()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ data }))
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ msg: `File [${name}] not found!` }))
  }
}

export function post(req, res) {
  const { name } = req.query
  const { data } = req.body

  console.log({ save: name })

  const file = path.join('src', 'routes', '_examples', name + '.hm')
  fs.writeFileSync(file, data)

  res.writeHead(201, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ msg: `File [${name}] updated.` }))
}
