import type { RequestWithUrl } from './types.ts'

export function parseTokenFromQuery(req: RequestWithUrl): string | null {
  const url = new URL(req.url ?? '', 'http://localhost')

  return url.searchParams.get('token')
}
export function parseObsDetailFromQuery(req: RequestWithUrl) {
  const url = new URL(req.url ?? '', 'http://localhost')
  let rpcVersion: number

  try {
    rpcVersion = Number.parseInt(url.searchParams.get('rpcV') || '1')
  } catch {
    rpcVersion = 1
  }

  return {
    rpcVersion,
    obsWebSocketVersion: url.searchParams.get('obsWV') || '5.5.6',
  }
}
