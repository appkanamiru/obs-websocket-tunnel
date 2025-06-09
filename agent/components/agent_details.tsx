'use client'

import { useObs } from '@/providers/obs_provider'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import TextField from '@/components/shared/text_field'
import Button from '@/components/shared/button'
import { validateWebSocketEndpoint } from '@/validations/common'

export default function AgentDetails() {
  const { agentToken, agentEndpoint, saveAgentToken, saveAgentEndpoint } = useObs()

  const [newToken, setNewToken] = useState('')
  const [newEndpoint, setNewEndpoint] = useState('')

  const submitHandler = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      saveAgentToken(newToken)
      saveAgentEndpoint(newEndpoint)
    },
    [newEndpoint, newToken, saveAgentEndpoint, saveAgentToken],
  )

  useEffect(() => {
    setNewToken(agentToken)
    setNewEndpoint(agentEndpoint)
  }, [agentEndpoint, agentToken])

  return (
    <form onSubmit={submitHandler} className="flex flex-col items-center gap-2">
      <h2 className="text-lg">Agent details</h2>
      <div>
        <TextField
          value={newToken}
          onChange={setNewToken}
          label="Token"
          error={newToken.length === 0}
          helperText={newToken.length === 0 ? 'Invalid token' : undefined}
        />
        <TextField
          value={newEndpoint}
          onChange={setNewEndpoint}
          error={!validateWebSocketEndpoint(newEndpoint)}
          helperText={validateWebSocketEndpoint(newEndpoint) ? undefined : 'Invalid endpoint'}
          label="Endpoint"
        />
      </div>
      <Button
        disabled={
          (newToken === agentToken && newEndpoint === agentEndpoint) ||
          newToken.length === 0 ||
          !validateWebSocketEndpoint(newEndpoint)
        }
        label="Save"
        bgColor="bg-emerald-400"
      />
    </form>
  )
}
