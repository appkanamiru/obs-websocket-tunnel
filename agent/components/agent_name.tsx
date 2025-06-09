'use client'

import { useEffect, useState } from 'react'

export default function AgentName() {
  const [subdomain, setSubdomain] = useState('')

  useEffect(() => {
    const url = new URL(location.href)
    const hostnameParts = url.hostname.split('.')

    if (hostnameParts.length === 3) {
      setSubdomain(url.hostname.split('.')[0])
    }
  }, [])

  return <h1 className="text-2xl self-center">OBS agent - {subdomain}</h1>
}
