import { CSSProperties, useEffect, useRef, useState } from 'react'

import { useEventListener } from './use-event-listener'

export function useTable(input: IInput) {
  const { cols, rows } = input

  const gutter = { top: 0, right: 0, bottom: 0, left: 0, ...input.gutter }
  const gutterX = gutter.left + gutter.right
  const gutterY = gutter.top + gutter.bottom

  const colGap = cols.gap || 0
  const rowGap = rows.gap || 0

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
   * Virtual cells are the cells that actually exist in the DOM.
   * They are calculated based on the amount of cells that are visible in the root element.
   */
  const [, setVirtualCells] = useState<IVirtualCellsContainer>({
    amount: 0,
    items: {},
  })

  const virtualized = useRef<IVirtualized>({
    cells: [],
    meta: {
      cols: {
        amount: 0,
        firstIndex: 0,
        lastIndex: 0,
      },

      rows: {
        amount: 0,
        firstIndex: 0,
        lastIndex: 0,
      },
    },
  })

  const computeWrapperStyle = () => {
    wrapperStyle.current = createWrapperStyle({ gutter, cols, rows })
  }

  /**
   * Calculates and caches both virtual columns and virtual rows in the virtualCells state.
   */
  const computeVirtualCells = () => {
    const root = rootRef.current

    if (!root) {
      console.error(`[Virtualform] The root element is not mounted yet.`)

      return
    }

    const { scrollTop, scrollLeft } = root

    // first visible row is the row that is at the top of the root element
    // the first visible row cannot be less than 0
    // the first visible row cannot be greater than the total amount of rows
    // consider gaps and gutter
    const firstVisibleRowIndex = Math.min(
      Math.max(Math.floor((scrollTop - gutterY) / (rows.height + rowGap)), 0),
      rows.amount
    )

    // first col visible is the col that is at the left of the root element
    // the first visible col cannot be less than 0
    // the first visible col cannot be greater than the total amount of cols
    // consider gaps and gutter
    const firstVisibleColIndex = Math.min(
      Math.max(Math.floor((scrollLeft - gutterX) / (cols.width + colGap)), 0),
      cols.amount
    )

    // last visible row index is the row that is at the bottom of the root element
    // the last visible row cannot be less than 0
    // the last visible row cannot be greater than the total amount of rows
    // consider gaps and gutter
    const lastVisibleRowIndex = Math.min(
      Math.max(
        Math.ceil(
          (scrollTop + root.clientHeight - gutterY) / (rows.height + rowGap)
        ),
        0
      ),
      rows.amount
    )

    // last visible col index is the col that is at the right of the root element
    // the last visible col cannot be less than 0
    // the last visible col cannot be greater than the total amount of cols
    // consider gaps and gutter
    const lastVisibleColIndex = Math.min(
      Math.max(
        Math.ceil(
          (scrollLeft + root.clientWidth - gutterX) / (cols.width + colGap)
        ),
        0
      ),
      cols.amount
    )

    const virtualCells: IVirtualCellsContainer = {
      amount: 0,
      items: {},
    }

    for (
      let rowIndex = firstVisibleRowIndex;
      rowIndex < lastVisibleRowIndex;
      rowIndex++
    ) {
      for (
        let colIndex = firstVisibleColIndex;
        colIndex < lastVisibleColIndex;
        colIndex++
      ) {
        virtualCells.amount++

        const cellStyle: CSSProperties = {
          position: 'absolute',
          width: cols.width,
          height: rows.height,
          transform: createCellTranslate({
            gutter,
            col: { index: colIndex, width: cols.width, gap: colGap },
            row: { index: rowIndex, height: rows.height, gap: rowGap },
          }),
        }

        virtualCells.items[virtualCells.amount] = {
          index: colIndex + rowIndex * cols.amount,
          rowIndex,
          colIndex,

          getProps() {
            return {
              key: `${rowIndex}-${colIndex}`,
              style: cellStyle,
            }
          },
        }
      }
    }

    setVirtualCells(virtualCells)

    virtualized.current = {
      cells: Object.keys(virtualCells.items).map((key) => {
        return virtualCells.items[Number(key)]
      }),

      meta: {
        cols: {
          amount: lastVisibleColIndex - firstVisibleColIndex,
          firstIndex: firstVisibleColIndex,
          lastIndex: lastVisibleColIndex,
        },

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
    computeVirtualCells()
  }

  const handleScroll = () => {
    computeVirtualCells()
  }

  const handleResize = () => {
    recompute()
  }

  useEffect(() => {
    recompute()
  }, [])

  useEffect(() => {
    recompute()
  }, [rows.amount, cols.amount])

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

    computeVirtualCells,
  }
}

/**
 * Returns the translate value for a cell, taking into account all gutters, gaps, etc.
 */
function createCellTranslate({
  gutter,
  col,
  row,
}: {
  gutter: IGutter
  col: { index: number; width: number; gap: number }
  row: { index: number; height: number; gap: number }
}): string {
  const _gutter = { top: 0, right: 0, bottom: 0, left: 0, ...gutter }

  return `translate(${
    col.index * col.width + _gutter.left + col.index * col.gap
  }px, ${row.index * row.height + _gutter.top + row.index * row.gap}px)`
}

/**
 * Returns the style for the wrapper element, taking into account all gutters, gaps, etc.
 */
function createWrapperStyle({
  gutter,
  cols,
  rows,
}: {
  gutter: IGutter
  cols: IColsInput
  rows: IRowsInput
}): CSSProperties {
  const _gutter = { top: 0, right: 0, bottom: 0, left: 0, ...gutter }
  const gutterX = _gutter.left + _gutter.right
  const gutterY = _gutter.top + _gutter.bottom

  const colGap = cols.gap || 0
  const rowGap = rows.gap || 0

  return {
    width: cols.amount * cols.width + gutterX + (cols.amount - 1) * colGap,
    height: rows.amount * rows.height + gutterY + (rows.amount - 1) * rowGap,
  }
}

type IInput = {
  cols: IColsInput
  rows: IRowsInput
  gutter?: IGutter
}

type IColsInput = {
  amount: number
  width: number
  gap?: number
}

type IRowsInput = {
  amount: number
  height: number
  gap?: number
}

type IVirtualCellsContainer = {
  amount: number
  items: Record<Index, IVirtualCell>
}

type IVirtualCell = {
  index: Index
  rowIndex: Index
  colIndex: Index

  getProps: () => {
    key: string
    style: CSSProperties
  }
}

type IVirtualized = {
  /**
   * The cells that are currently visible.
   */
  cells: IVirtualCell[]

  /**
   * Meta information about the currently visible cells.
   */
  meta: {
    /**
     * The columns that are currently visible.
     */
    cols: {
      /**
       * The amount of columns that are currently visible.
       */
      amount: number

      /**
       * The index of the first column that is currently visible.
       */
      firstIndex: Index

      /**
       * The index of the last column that is currently visible.
       */
      lastIndex: Index
    }

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

type IGutter = RequireAtLeastOne<{
  left?: number
  top?: number
  right?: number
  bottom?: number
}>

type Index = number

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]
