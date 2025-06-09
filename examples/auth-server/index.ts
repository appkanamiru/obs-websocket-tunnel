import { createServer, IncomingMessage, ServerResponse } from 'node:http'
import type { AuthResponse } from '../../tunnel/types.ts'

const clients: Map<string, AuthResponse> = new Map()
clients.set('f2EazDD18Wm5XQHJ1qEge7bd0VXL0B', {
  uuid: 'ed73f9c6-f286-489a-b393-4763d816dc2d',
  type: 'agent',
})
clients.set('C8UfZSjbeNcrDtGJEf1vn5hQQp699J', {
  uuid: '9c19f6c2-400b-4e1e-9296-d509a1667997',
  type: 'operator',
  agentUUID: 'ed73f9c6-f286-489a-b393-4763d816dc2d',
  isViewOnly: false,
})

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const { method, url, headers } = req

  if (method === 'GET' && url === '/api/obs-clients/auth-token') {
    const token = headers['client-token']

    if (typeof token === 'string' && clients.has(token)) {
      const resBody: AuthResponse = clients.get(token)!

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(resBody))
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Client-Token header missing or invalid' }))
    }
    return
  }

  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello')
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not Found' }))
})

const port = 3000
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
