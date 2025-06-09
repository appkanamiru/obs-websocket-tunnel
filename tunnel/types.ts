import type { WebSocket } from 'ws'

export type AppConfig = {
  host: string
  port: number
  authEndpoint: string
}

export type ClientId = string
export type ClientType = 'operator' | 'agent'
export type ClientTypeMap = {
  operator: Operator
  agent: Agent
}
export type ClientByType<T extends ClientType> = ClientTypeMap[T]

export type Operator = {
  uuid: ClientId
  type: 'operator'
  isViewOnly: boolean
  agentUUID: ClientId
  ws?: WebSocket
}
export type Agent = {
  uuid: ClientId
  type: 'agent'
  ws?: WebSocket
  obsWebSocketVersion: string
  rpcVersion: number
}

export type RequestWithUrl = {
  url?: string
}
export type AuthToken = string
export type AuthResponse = {
  uuid: ClientId
  type: ClientType
  isViewOnly?: boolean
  agentUUID?: ClientId
}
