'use client'

import { useObs } from '@/providers/obs_provider'
import type { ConnectionStatus } from '@/types'
import { Check, LoaderCircle, X } from 'lucide-react'

export default function ConnectionStatus() {
  const { obsStatus, agentStatus } = useObs()

  return (
    <div className="flex flex-col w-56">
      <Status status={obsStatus} type="OBS" />
      <Status status={agentStatus} type="Agent" />
    </div>
  )
}

type StatusProps = {
  status: ConnectionStatus
  type: 'OBS' | 'Agent'
}
function Status({ status, type }: StatusProps) {
  return (
    <div className="flex gap-2">
      {status === 'connecting' ? (
        <LoaderCircle className="text-blue-500 animate-spin" />
      ) : status === 'connected' ? (
        <Check className="text-green-500" />
      ) : (
        <X className="text-red-500" />
      )}
      <div>
        {type} {status}
      </div>
    </div>
  )
}
