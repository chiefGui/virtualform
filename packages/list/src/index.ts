import { CSSProperties, useEffect, useRef, useState } from 'react'

import { useEventListener } from '../../util/use-event-listener'

export function useList(input: IInput) {
  const { rows, gap = 0 } = input

  const gutter = unpackGutter(input.gutter)
  const gutterY = gutter.top + gutter.bottom

  const rootRef = useRef<HTMLDivElement>(null)

  /**
   * The wrapper style is the actual style that is applied to the wrapper element.
   * It mostly contains the simulated width and height of the table.
   */
  const wrapperStyle = useRef<CSSProperties>({
    width: 'auto',
    height: 'auto',
  })

  /**
   * Virtual rows are the rows that actually exist in the DOM.
   */
  const [, setVirtualRows] = useState<IVirtualRowsContainer>({
    amount: 0,
    items: {},
  })

  /**
   * Just a reference to the virtualized state with some additional meta data.
   */
  const virtualized = useRef<IVirtualized>({
    rows: [],
    meta: {
      rows: {
        amount: 0,
        firstIndex: 0,
        lastIndex: 0,
      },
    },
  })

  const computeWrapperStyle = () =>
    (wrapperStyle.current = createWrapperStyle({ gutter, gap, rows }))

  /**
   * Calculates and caches virtual rows in the virtualRows state.
   */
  const computeVirtualRows = () => {
    const root = rootRef.current

    if (!root) {
      console.error(`[Virtualform] The root element is not mounted yet.`)

      return
    }

    const { scrollTop, scrollLeft } = root

    // first visible row is the row that is at the top of the root element
    // the first visible row cannot be less than 0
    // the first visible row cannot be greater than the total amount of rows
    // consider gaps and both vertical and horizontal gutters
    const firstVisibleRowIndex = Math.min(
      Math.max(
        Math.floor((scrollTop - gutterY + gap) / (rows.height + gap)),
        0
      ),
      rows.amount
    )

    // last visible row index is the row that is at the bottom of the root element
    // the last visible row cannot be less than 0
    // the last visible row cannot be greater than the total amount of rows
    // consider gaps and gutter
    const lastVisibleRowIndex = Math.min(
      Math.max(
        Math.ceil(
          (scrollTop + root.clientHeight - gutterY) / (rows.height + gap)
        ),
        0
      ),
      rows.amount
    )

    const nextVirtualRows: IVirtualRowsContainer = {
      amount: 0,
      items: {},
    }

    for (
      let rowIndex = firstVisibleRowIndex;
      rowIndex < lastVisibleRowIndex;
      rowIndex++
    ) {
      nextVirtualRows.amount++

      const cellStyle: CSSProperties = {
        position: 'absolute',
        height: rows.height,
        transform: createCellTranslate({
          gutter,
          row: { index: rowIndex, height: rows.height, gap },
        }),
      }

      nextVirtualRows.items[nextVirtualRows.amount] = {
        index: rowIndex,

        getProps() {
          return {
            key: rowIndex.toString(),
            style: cellStyle,
          }
        },
      }
    }

    setVirtualRows(nextVirtualRows)

    virtualized.current = {
      rows: Object.keys(nextVirtualRows.items).map((key) => {
        return nextVirtualRows.items[Number(key)]
      }),

      meta: {
        rows: {
          amount: lastVisibleRowIndex - firstVisibleRowIndex,
          firstIndex: firstVisibleRowIndex,
          lastIndex: lastVisibleRowIndex,
        },
      },
    }
  }

  const recompute = () => {
    computeWrapperStyle()
    computeVirtualRows()
  }

  const handleScroll = () => {
    computeVirtualRows()
  }

  const handleResize = () => {
    recompute()
  }

  useEffect(() => {
    recompute()
  }, [])

  useEffect(() => {
    recompute()
  }, [rows.amount])

  useEventListener('scroll', handleScroll, rootRef)
  useEventListener('resize', handleResize)

  return {
    getRootProps() {
      return {
        ref: rootRef,

        style: {
          position: 'relative',
          overflow: 'auto',
        } as CSSProperties,
      }
    },

    getWrapperProps() {
      return {
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'flex',
          width: wrapperStyle.current.width,
          height: wrapperStyle.current.height,
        } as CSSProperties,
      }
    },

    virtualized: virtualized.current,

    computeVirtualRows,
  }
}

/**
 * Returns the translate value for a cell, taking into account all gutters, gaps, etc.
 */
function createCellTranslate({
  gutter,
  row,
}: {
  gutter: IGutter
  row: { index: number; height: number; gap: number }
}): string {
  return `translate(${gutter.left}px, ${
    gutter.top + row.index * (row.height + row.gap)
  }px)`
}

/**
 * Returns the style for the wrapper element, taking into account all gutters, gaps, etc.
 */
function createWrapperStyle({
  gutter,
  gap,
  rows,
}: {
  gutter: IGutter
  gap: number
  rows: IRowsInput
}): CSSProperties {
  const gutterX = gutter.left + gutter.right
  const gutterY = gutter.top + gutter.bottom

  return {
    width: `calc(100% - ${gutterX}px)`,
    height: rows.amount * rows.height + gutterY + (rows.amount - 1) * gap,
  }
}

function unpackGutter(gutter?: IInputGutter): IGutter {
  if (!gutter) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }
  }

  if (typeof gutter === 'number') {
    return {
      top: gutter,
      right: gutter,
      bottom: gutter,
      left: gutter,
    }
  }

  return {
    top: gutter.top || 0,
    right: gutter.right || 0,
    bottom: gutter.bottom || 0,
    left: gutter.left || 0,
  }
}

type IInput = {
  rows: IRowsInput
  gap?: number
  gutter?: IInputGutter
}

type IRowsInput = {
  amount: number
  height: number
}

type IVirtualRowsContainer = {
  amount: number
  items: Record<Index, IVirtualRow>
}

type IVirtualRow = {
  index: Index

  getProps: () => {
    key: string
    style: CSSProperties
  }
}

type IVirtualized = {
  /**
   * The cells that are currently visible.
   */
  rows: IVirtualRow[]

  /**
   * Meta information about the currently visible cells.
   */
  meta: {
    /**
     * The rows that are currently visible.
     */
    rows: {
      /**
       * The amount of rows that are currently visible.
       */
      amount: number

      /**
       * The index of the first row that is currently visible.
       */
      firstIndex: Index

      /**
       * The index of the last row that is currently visible.
       */
      lastIndex: Index
    }
  }
}

type IInputGutter =
  | RequireAtLeastOne<{
      left?: number
      top?: number
      right?: number
      bottom?: number
    }>
  | number

type IGutter = {
  left: number
  top: number
  right: number
  bottom: number
}

type Index = number

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]
