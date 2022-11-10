import { useCallback, useEffect, useState } from 'react'

import { useEventListener } from '@virtualform/grid/src/use-event-listener'

export function useAvailableSpace({
  ref,
}: {
  ref: React.RefObject<HTMLElement>
}) {
  const [availableSpace, setAvailableSpace] = useState({
    width: 0,
    height: 0,
  })

  const updateAvailableSpace = useCallback(() => {
    if (ref.current) {
      const { x, y } = ref.current.getBoundingClientRect()

      setAvailableSpace({
        width: window.innerWidth - x,
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
