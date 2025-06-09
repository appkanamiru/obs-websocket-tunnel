export type OpCodeHello = 0
export type OpCodeIdentify = 1
export type OpCodeIdentified = 2
export type OpCodeReidentify = 3
export type OpCodeEvent = 5
export type OpCodeRequest = 6
export type OpCodeResponse = 7
export type OpCodeRequestBatch = 8
export type OpCodeResponseBatch = 9

export type OpCode =
  | OpCodeHello
  | OpCodeIdentify
  | OpCodeIdentified
  | OpCodeReidentify
  | OpCodeEvent
  | OpCodeRequest
  | OpCodeResponse
  | OpCodeRequestBatch
  | OpCodeResponseBatch

export type MessageMap = {
  0: HelloMessage
  1: IdentifyMessage
  2: IdentifiedMessage
}

export type Message = {
  op: OpCode
  d: any
}
export type HelloMessage = {
  op: 0
  d: {
    obsWebSocketVersion: string
    rpcVersion: number
  }
}
export type IdentifyMessage = {
  op: 1
  d: {
    rpcVersion: number
  }
}
export type IdentifiedMessage = {
  op: 2
  d: {
    negotiatedRpcVersion: number
  }
}
