import { useState, useEffect } from 'react'

export function useIsServer(): boolean {
  const [isServer, setIsServer] = useState<boolean>(true)

  useEffect(() => {
    setIsServer(false)
  }, [])
  return isServer
}
