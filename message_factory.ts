import type { HelloMessage, MessageMap } from './types.ts'

function createMessage<T extends keyof MessageMap>(op: T, d: MessageMap[T]['d']): MessageMap[T] {
  return {
    op,
    d,
  } as MessageMap[T]
}

export function createHelloMessage(
  obsWebSocketVersion: string = '5.5.6',
  rpcVersion: number = 1,
): HelloMessage {
  return createMessage(0, {
    obsWebSocketVersion,
    rpcVersion,
  })
}
export function createIdentifyMessage(rpcVersion: number = 1) {
  return createMessage(1, {
    rpcVersion,
  })
}
export function createIdentifiedMessage(negotiatedRpcVersion: number = 1) {
  return createMessage(2, {
    negotiatedRpcVersion,
  })
}
