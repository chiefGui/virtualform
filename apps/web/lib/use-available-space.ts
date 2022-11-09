import { useCallback, useEffect, useState } from 'react'

import { useEventListener } from '@refocus/grid/src/use-event-listener'

export function useAvailableSpace({
  ref,
}: {
  ref: React.RefObject<HTMLElement>
}) {
  const [availableSpace, setAvailableSpace] = useState({ width: 0, height: 0 })

  const updateAvailableSpace = useCallback(() => {
    if (ref.current) {
      const { x, y } = ref.current.getBoundingClientRect()

      const height = window.innerHeight - y

      ref.current.style.height = `${height}px`

      setAvailableSpace({
        width: window.innerWidth - x * 2,
        height: window.innerHeight - y,
      })
    }
  }, [ref])

  useEffect(updateAvailableSpace, [])
  useEffect(updateAvailableSpace, [ref])
  useEventListener('resize', updateAvailableSpace)

  return {
    ...availableSpace,
  }
}
