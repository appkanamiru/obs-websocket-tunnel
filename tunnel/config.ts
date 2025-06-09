import type { AppConfig } from './types.ts'

let appConfig: AppConfig

export function loadAppConfig() {
  try {
    const host = process.env.HOST
    const port = Number.parseInt(process.env.PORT || '')
    const authEndpoint = process.env.AUTH_ENDPOINT

    if (host !== undefined && authEndpoint !== undefined) {
      appConfig = {
        host,
        port,
        authEndpoint,
      }
    } else {
      console.error('App config invalid')
      throw new Error('Invalid host or authEndpoint')
    }
  } catch {
    process.exit(1)
  }
}
export function getConfig(): AppConfig {
  return appConfig
}
