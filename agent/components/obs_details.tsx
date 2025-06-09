'use client'

import { useObs } from '@/providers/obs_provider'
import Button from '@/components/shared/button'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import TextField from '@/components/shared/text_field'
import { validatePort } from '@/validations/common'

export default function ObsDetails() {
  const { password, port, savePort, savePassword } = useObs()

  const [newPassword, setNewPassword] = useState('')
  const [newPort, setNewPort] = useState('')

  const submitHandler = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      savePort(newPort)
      savePassword(newPassword)
    },
    [newPassword, newPort, savePassword, savePort],
  )

  useEffect(() => {
    setNewPassword(password)
    setNewPort(port)
  }, [password, port])

  return (
    <form onSubmit={submitHandler} className="flex flex-col items-center gap-2">
      <h2 className="text-lg">OBS details</h2>
      <div>
        <TextField
          value={newPort}
          onChange={setNewPort}
          error={!validatePort(newPort)}
          helperText={validatePort(newPort) ? undefined : 'Invalid port'}
          label="Port"
        />
        <TextField value={newPassword} onChange={setNewPassword} label="Password" />
      </div>
      <Button
        disabled={(newPassword === password && newPort === port) || !validatePort(newPort)}
        label="Save"
        bgColor="bg-emerald-400"
      />
    </form>
  )
}
