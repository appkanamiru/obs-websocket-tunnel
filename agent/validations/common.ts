export function validatePort(port: string): boolean {
  const portNumber = Number(port)

  return /^\d+$/.test(port) && portNumber >= 0 && portNumber <= 65535
}

export function validateWebSocketEndpoint(endpoint: string): boolean {
  try {
    const url = new URL(endpoint)

    const isWsProtocol = url.protocol === 'ws:' || url.protocol === 'wss:'
    const isValidHost = !!url.hostname
    const isValidPort = url.port === '' || validatePort(url.port)

    return isWsProtocol && isValidHost && isValidPort
  } catch {
    return false
  }
}
