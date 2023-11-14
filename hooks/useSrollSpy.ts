import { useState, useRef, useEffect } from 'react'

export function useScrollSpy(selectors: string[], options?: IntersectionObserverInit) {
  const [activeId, setActiveId] = useState<string>()
  const observer = useRef<IntersectionObserver>()
  useEffect(() => {
    if (typeof window === 'undefined' || !document) {
      return
    }
    const elements = selectors.reverse().map(selector => document.querySelector(selector))
    if (observer.current) {
      observer.current.disconnect()
    }
    observer.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry?.isIntersecting && entry?.target?.getAttribute('id')) {
          setActiveId(String(entry.target.getAttribute('id')))
        }
      })
    }, options)
    elements.forEach(element => element && observer?.current?.observe(element))
    // eslint-disable-next-line consistent-return
    return () => observer?.current?.disconnect()
  }, [selectors])

  return activeId
}
