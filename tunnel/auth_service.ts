import type { AuthResponse, AuthToken } from './types.ts'
import { isAuthResponse } from './auth_guards.ts'
import { getConfig } from './config.ts'

export async function authByToken(token: AuthToken): Promise<AuthResponse> {
  const appConfig = getConfig()
  const res = await fetch(appConfig.authEndpoint, {
    headers: {
      'Content-Type': 'application/json',
      'Client-Token': token,
    },
  })

  if (!res.ok) {
    throw new Error('Unauthorized')
  }
  const body = await res.json()

  if (!isAuthResponse(body)) {
    throw new Error('Invalid response structure')
  }

  return body
}
