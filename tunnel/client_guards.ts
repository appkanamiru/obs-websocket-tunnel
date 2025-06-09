import type { Agent, Operator } from './types.ts'

export function isGui(client: unknown): client is Operator {
  return (
    typeof client === 'object' &&
    client !== null &&
    (client as Operator).type === 'operator' &&
    typeof (client as Operator).agentUUID === 'string'
  )
}

export function isAgent(client: unknown): client is Agent {
  return typeof client === 'object' && client !== null && (client as Agent).type === 'agent'
}
