import type { OpCode } from './types.ts'

export function isValidOpCode(op: unknown): op is OpCode {
  return typeof op === 'number' && [0, 1, 2, 3, 5, 6, 7, 8, 9].includes(op)
}
