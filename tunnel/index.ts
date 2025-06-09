import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import type { Agent, ClientId, Operator } from './types.ts'
import type { Message } from '../types.ts'
import { createClient } from './client_factories.ts'
import { createHelloMessage, createIdentifiedMessage } from '../message_factory.ts'
import { parseMessageFromJson } from '../parsers.ts'
import { parseObsDetailFromQuery, parseTokenFromQuery } from './parsers.ts'
import { authByToken } from './auth_service.ts'
import { getConfig, loadAppConfig } from './config.ts'

// Load config from .env
loadAppConfig()
const appConfig = getConfig()
// Create http server
const server = createServer()
// Create ws server
const wss = new WebSocketServer({ noServer: true })
// Handle close and error on wss
wss.addListener('close', () => {
  console.log('🚧 Server closed')
})
wss.addListener('error', (error) => {
  console.log(`❌ Server error: ${error.message}`)
})
// Clients maps
const operators = new Map<ClientId, Operator>()
const agents = new Map<ClientId, Agent>()
const operatorsByAgent = new Map<ClientId, Set<ClientId>>()
// Gracefully shutdown
process.addListener('SIGINT', () => {
  console.log('🌈 Gracefully shutdown started...')

  for (const client of wss.clients) {
    client.close(1012, 'Server shutting down')
  }
  agents.clear()
  operators.clear()
  operatorsByAgent.clear()

  wss.close(() => {
    console.log('🧹 WebSocket server closed')
    server.close(() => {
      console.log('✅ Shutdown complete')
      process.exit(0)
    })
  })
})
// Handle new connection on server
wss.addListener('connection', (ws, req, client: Operator | Agent) => {
  client.ws = ws

  if (client.type === 'operator') {
    operators.set(client.uuid, client)
    operatorsByAgent.get(client.agentUUID)?.add(client.uuid)
    ws.send(JSON.stringify(createHelloMessage()))
  } else if (client.type === 'agent') {
    agents.set(client.uuid, client)
    operatorsByAgent.set(client.uuid, new Set())
  } else {
    return ws.close(4001, 'Invalid client type')
  }

  ws.addEventListener('message', (event) => {
    try {
      let msg: Message

      try {
        msg = parseMessageFromJson(event.data.toString())
      } catch (error) {
        let errorMessage: string | undefined

        if (error instanceof Error) {
          errorMessage = error.message
        }
        return ws.close(4002, errorMessage || 'Invalid JSON')
      }

      switch (client.type) {
        case 'operator':
          switch (msg.op) {
            case 1: // Indentify
              ws.send(JSON.stringify(createIdentifiedMessage()))
              break
            case 6: // Request
              if (!client.isViewOnly) {
                agents.get(client.agentUUID)?.ws?.send(event.data)
              }
              break
          }
          break
        case 'agent':
          switch (msg.op) {
            case 5: // Event
            case 7: // Response
              for (const oId of operatorsByAgent.get(client.uuid) || new Set()) {
                operators.get(oId)?.ws?.send(event.data)
              }
              break
          }
          break
      }
    } catch (error) {
      console.error('📛 Uncaught error in message handler:', error)
      ws.close(1011, 'Internal server error')
    }
  })
  ws.addEventListener('close', () => {
    switch (client.type) {
      case 'operator':
        operatorsByAgent.get(client.agentUUID)?.delete(client.uuid)
        operators.delete(client.uuid)
        break
      case 'agent':
        for (const oId of operatorsByAgent.get(client.uuid) || new Set()) {
          operators.get(oId)?.ws?.close(4005, 'Agent disconnected')
        }
        operatorsByAgent.delete(client.uuid)
        agents.delete(client.uuid)
        break
    }
  })
})
// HTTP upgrade listener – authenticate client
server.on('upgrade', (req, socket, head) => {
  const token = parseTokenFromQuery(req)

  if (token === null || token.length === 0) {
    socket.write('HTTP/1.1 400 Bad Request\r\n\r\nMissing token')
    socket.destroy()
    return
  }
  authByToken(token)
    .then((authRes) => {
      if (socket.destroyed) {
        return
      }
      let client: Operator | Agent

      if (authRes.type === 'operator' && authRes.agentUUID !== undefined) {
        client = createClient(authRes.type, {
          uuid: authRes.uuid,
          agentUUID: authRes.agentUUID,
          isViewOnly: authRes.isViewOnly === true,
        })

        if (operators.has(client.uuid)) {
          socket.write('HTTP/1.1 409 Conflict\r\n\rOperator already connected')
          socket.destroy()
          return
        }

        if (!agents.has(client.agentUUID)) {
          socket.write('HTTP/1.1 404 Not Found\r\n\r\nAgent offline')
          socket.destroy()
          return
        }
      } else if (authRes.type === 'agent') {
        const obsDetails = parseObsDetailFromQuery(req)
        client = createClient(authRes.type, {
          uuid: authRes.uuid,
          obsWebSocketVersion: obsDetails.obsWebSocketVersion,
          rpcVersion: obsDetails.rpcVersion,
        })

        if (agents.has(client.uuid)) {
          socket.write('HTTP/1.1 409 Conflict\r\n\r\nAgent already connected')
          socket.destroy()
          return
        }
      } else {
        socket.write('HTTP/1.1 400 Bad Request\r\n\r\nInvalid client type')
        socket.destroy()
        return
      }

      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req, client)
      })
    })
    .catch(() => {
      if (socket.destroyed) {
        return
      }
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\nInvalid token')
      socket.destroy()
    })
})
server.listen(appConfig.port, appConfig.host, () => {
  console.log(`🚀 Server listening on ${appConfig.host}:${appConfig.port}`)
})
