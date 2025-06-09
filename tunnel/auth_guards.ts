import type { AuthResponse } from './types.ts'

export function isAuthResponse(obj: any): obj is AuthResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.uuid === 'string' &&
    typeof obj.type === 'string' &&
    (obj.isViewOnly === undefined || typeof obj.isViewOnly === 'boolean') &&
    (obj.agentUUID === undefined || typeof obj.agentUUID === 'string')
  )
}
