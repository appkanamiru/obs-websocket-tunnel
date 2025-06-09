import { isValidOpCode } from './message_guards.ts'
import type { Message } from './types.ts'

export function parseMessageFromJson(json: string): Message {
  let raw: unknown

  try {
    raw = JSON.parse(json)
  } catch {
    throw new Error('Invalid JSON')
  }

  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Invalid message')
  }

  const { op, d } = raw as { op?: unknown; d?: unknown }

  if (!isValidOpCode(op)) {
    throw new Error('Invalid op code')
  }

  return { op, d } as Message
}
