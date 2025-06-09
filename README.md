# OBS WebSocket Tunnel

A tunneling solution to securely connect third-party OBS WebSocket clients to OBS instances running behind firewalls or on local networks.

## Overview

This project consists of two components:

1. **Tunnel Server** (Node.js) — A WebSocket server that manages bi-directional communication between clients.
2. **Agent** A local client that connects to a local OBS WebSocket server and relays messages through the tunnel.
3. **Operator** — Any third-party application implementing OBS WebSocket communication.

## Use Case

This tunnel is designed to enable secure and remote access to OBS WebSocket APIs, especially when OBS is running on a local machine not accessible from the internet.

## Architecture

- Operators and agents connect to the Tunnel Server using a token passed via a query parameter.
- The Tunnel Server authenticates each client using an HTTP GET request to a configured `AUTH_URL`.
- Upon successful authentication, a WebSocket upgrade is performed.
- Each client (agent or operator) is allowed only one active connection; a new connection will terminate the previous one.

## Authentication

During WebSocket upgrade, the server performs a GET request to `AUTH_URL` with the provided token.

Expected response:

```json
{
  "uuid": "string",
  "type": "agent" | "operator",
  "isViewOnly": boolean?,         // for operator only
  "agentUUID": "string"?          // for operator only
}

```

If the response is 200 OK and the body is valid JSON with the required fields, the connection proceeds.

## Agent Behavior

- The agent runs on the same machine as OBS.
- Once authenticated with the tunnel, it connects to the local OBS WebSocket server using the provided port and password.
- After a successful connection to OBS, the agent establishes a WebSocket tunnel to the server.

## Operator Behavior

- The operator (e.g., web UI) initiates a WebSocket connection to the tunnel server.

- After authentication, it communicates with the OBS instance via the agent through the tunnel.

## Installation

### Tunnel Server

```bash
cd tunnel
npm install
cp .env.example .env
npm run start
```

### Agent

```bash
cd agent
npm install
npm run build
```

- Host files in out foleder as static

## Environment Variables

#### Tunnel Server (.env):

- HOST=localhost
- PORT=9090
- AUTH_URL=https://your-auth-service/validate

## Security

- All communication should be secured using WSS (WebSocket over HTTPS).
- Tokens should be short-lived and validated via a trusted authentication endpoint.
- Consider using reverse proxies like Nginx with SSL termination.
