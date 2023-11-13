import { useState, useEffect } from 'react'

export function useScrollingEvent(): boolean {
  const [isScrolling, setIsScrolling] = useState<boolean>(false)
  let timer: NodeJS.Timeout | null = null

  function onScroll(): void {
    setIsScrolling(true)
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      setIsScrolling(false)
    }, 1000)
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return isScrolling
}
