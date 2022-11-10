'use client'

import { useEffect, useState } from 'react'

import { useGrid } from '@virtualform/grid'
import { useSuperState } from '@superstate/react'

import { Pic } from '../pic'
import { Playground } from '../../lib/playground'
import { randomItems } from '../../lib/random-items'
import { useAvailableSpace } from '../../lib/use-available-space'

export default function Page() {
  useSuperState(Playground.state)

  const [items, setItems] = useState(
    randomItems(Playground.state.now().itemsAmount)
  )

  const {
    getParentProps,
    getWrapperProps,
    getRows,
    cells,
    recompute,
    rowsAmount,
  } = useGrid({
    cells: items.length,

    cols: {
      minmax: [100, 100],
    },

    rows: {
      height: 100,
    },

    gap: Playground.gap,
    gutter: Playground.gutter,
  })

  const { style, ...parentProps } = getParentProps()
  const { height } = useAvailableSpace({ ref: parentProps.ref })
  const { containerPercentage } = Playground.state.now()

  useEffect(() => {
    const unsub = Playground.state.subscribe(() => {
      setItems(randomItems(Playground.state.now().itemsAmount))
    })

    return () => {
      unsub()
    }
  }, [])

  useEffect(recompute, [containerPercentage])

  return (
    <div className='w-full h-full'>
      <div
        style={{
          ...style,
          height,
          width: `${containerPercentage}%`,
        }}
        {...parentProps}>
        <div {...getWrapperProps()}>
          {cells.map((cell) => {
            return (
              <div {...cell.getProps()}>
                <Pic indicator={cell.index + 1} src={items[cell.index]} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
