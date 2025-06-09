'use client'

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { parseMessageFromJson } from '../../parsers'
import { createIdentifyMessage } from '../../message_factory'
import type { Message } from '../../types'
import type { ConnectionStatus } from '../types'
import { validateWebSocketEndpoint } from '@/validations/common'

type ObsProviderProps = {
  children: ReactNode
}
type ObsContextType = {
  password: string
  port: string
  agentToken: string
  agentEndpoint: string
  obsStatus: ConnectionStatus
  agentStatus: ConnectionStatus
  savePassword: (value: string) => void
  savePort: (value: string) => void
  saveAgentToken: (value: string) => void
  saveAgentEndpoint: (value: string) => void
}

const defaults: ObsContextType = {
  password: '',
  port: '4455',
  agentToken: '',
  agentEndpoint: 'ws://localhost:9090',
  obsStatus: 'disconnected',
  agentStatus: 'disconnected',
  savePassword: () => {},
  savePort: () => {},
  saveAgentToken: () => {},
  saveAgentEndpoint: () => {},
}
const ObsContext = createContext<ObsContextType>(defaults)

export default function ObsProvider({ children }: ObsProviderProps) {
  const [password, setPassword] = useState(defaults.password)
  const [port, setPort] = useState(defaults.port)
  const [agentToken, setAgentToken] = useState(defaults.agentToken)
  const [agentEndpoint, setAgentEndpoint] = useState(defaults.agentEndpoint)
  const [obsStatus, setObsStatus] = useState(defaults.obsStatus)
  const [agentStatus, setAgentStatus] = useState(defaults.agentStatus)

  const isLoadedRef = useRef(false)
  const obsRef = useRef<WebSocket | null>(null)
  const agentRef = useRef<WebSocket | null>(null)
  const obsTimeoutRef = useRef<NodeJS.Timeout>(undefined)
  const agentTimeoutRef = useRef<NodeJS.Timeout>(undefined)

  const disconnectAgent = useCallback(() => {
    clearInterval(agentTimeoutRef.current)
    agentRef.current?.close()
    agentRef.current = null
    clearInterval(agentTimeoutRef.current)
  }, [])
  const connectAgent = useCallback(() => {
    disconnectAgent()

    if (agentToken.length === 0 || !validateWebSocketEndpoint(agentEndpoint)) {
      return
    }
    setAgentStatus('connecting')
    // New connection
    const server = new WebSocket(`${agentEndpoint}?token=${agentToken}`)

    server.addEventListener('open', () => {
      console.log('SERVER open')
      clearInterval(agentTimeoutRef.current)
      agentRef.current = server
      setAgentStatus('connected')
    })
    server.addEventListener('error', () => {
      console.log('SERVER error')
    })
    server.addEventListener('close', (event) => {
      console.log('SERVER close', event.code, event.reason)
      agentRef.current = null
      agentTimeoutRef.current = setTimeout(() => {
        connectAgent()
      }, 5000)
      setAgentStatus('disconnected')
    })
    server.addEventListener('message', (event) => {
      console.log('SERVER message')
      obsRef.current?.send(event.data)
    })
  }, [agentEndpoint, agentToken, disconnectAgent])
  const disconnectObs = useCallback(() => {
    disconnectAgent()
    clearTimeout(obsTimeoutRef.current)
    obsRef.current?.close()
    obsRef.current = null
    clearTimeout(obsTimeoutRef.current)
  }, [disconnectAgent])
  const connectObs = useCallback(() => {
    disconnectObs()
    setObsStatus('connecting')
    // New connection
    const obs = new WebSocket(`ws://localhost:${port}`)

    obs.addEventListener('open', () => {
      console.log('OBS open')
      clearTimeout(obsTimeoutRef.current)
      obsRef.current = obs
    })
    obs.addEventListener('error', () => {
      console.log('OBS error')
    })
    obs.addEventListener('close', (event) => {
      console.log('OBS close', event.code, event.reason)
      disconnectObs()
      obsTimeoutRef.current = setTimeout(() => {
        connectObs()
      }, 5000)
      setObsStatus('disconnected')
    })
    obs.addEventListener('message', (message) => {
      console.log('OBS message')
      let msg: Message

      try {
        msg = parseMessageFromJson(message.data)
      } catch {
        return
      }

      switch (msg.op) {
        case 0: // Hello
          obs.send(JSON.stringify(createIdentifyMessage())) // TODO sign in with password
          break
        case 2: // Identified
          connectAgent()
          setObsStatus('connected')
          break
        case 5: // Event
        case 7: // Response
          agentRef.current?.send(message.data)
          break
      }
    })
  }, [connectAgent, disconnectObs, port])
  const savePassword = useCallback((value: string) => {
    localStorage.setItem('obsPassword', value)
    setPassword(value)
  }, [])
  const savePort = useCallback((value: string) => {
    localStorage.setItem('obsPort', value)
    setPort(value)
  }, [])
  const saveAgentToken = useCallback((value: string) => {
    localStorage.setItem('agentToken', value)
    setAgentToken(value)
  }, [])
  const saveAgentEndpoint = useCallback((value: string) => {
    localStorage.setItem('agentEndpoint', value)
    setAgentEndpoint(value)
  }, [])

  useEffect(() => {
    const storedPassword = localStorage.getItem('obsPassword') || defaults.password
    const storedPort = localStorage.getItem('obsPort') || defaults.port
    const storedAgentToken = localStorage.getItem('agentToken') || defaults.agentToken
    const storedAgentEndpoint = localStorage.getItem('agentEndpoint') || defaults.agentEndpoint

    setPassword(storedPassword)
    setPort(storedPort)
    setAgentToken(storedAgentToken)
    setAgentEndpoint(storedAgentEndpoint)
    isLoadedRef.current = true
  }, [])
  useEffect(() => {
    if (!isLoadedRef.current) {
      return
    }
    connectObs()
  }, [connectObs])

  const contextValue = useMemo(() => {
    return {
      password,
      port,
      agentToken,
      obsStatus,
      agentStatus,
      agentEndpoint,
      savePassword,
      savePort,
      saveAgentToken,
      saveAgentEndpoint,
    }
  }, [
    agentEndpoint,
    agentStatus,
    agentToken,
    obsStatus,
    password,
    port,
    saveAgentEndpoint,
    saveAgentToken,
    savePassword,
    savePort,
  ])

  return <ObsContext.Provider value={contextValue}>{children}</ObsContext.Provider>
}
export function useObs() {
  const context = useContext(ObsContext)

  if (!context) {
    throw new Error('useObs must be use within ObsProvider')
  }

  return context
}
