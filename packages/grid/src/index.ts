import {
  CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { useEventListener } from './use-event-listener'

export function useGrid(input: IInput) {
  const { cells, gap = 0, gutter = 0, overscan = 0 } = input

  const rootRef = useRef<HTMLDivElement>(null)

  const availableWidth = useRef(0)
  const wrapperHeight = useRef(0)
  const rowsData = useRef<IRowsData>({ amount: 0, rows: {} })
  const colsData = useRef<IColsData>({
    width: 0,
    maxPerRow: 0,
    cols: {},
  })

  const computedRowCells = useRef<IComputedCell[][]>([])
  const mountedRowsIndices = useRef<Index[]>([])

  const [, setChecksum] = useState(-9999999999)

  /**
   * Caches the available width for the grid.
   *
   * @returns
   */
  const cacheAvailableWidth = useCallback(() => {
    const root = rootRef.current

    if (!root) {
      console.error(`[Virtualform] The root element is not mounted yet.`)

      return 0
    }

    availableWidth.current = root.clientWidth - gutter * 2
  }, [gutter])

  /**
   * Caches how many columns each row can have,
   * as well as the width of each column.
   *
   * The width of all columns in a row must occupy the entire available width,
   * but can not be greater than the maximum width.
   */
  const cacheCols = useCallback(() => {
    const { width } = cells

    const colsPerRow = Math.floor(availableWidth.current / (width + gap))

    const colWidth =
      (availableWidth.current - gap * (colsPerRow - 1)) / colsPerRow

    colsData.current = {
      width: colWidth,
      maxPerRow: colsPerRow,
      cols: {},
    }

    for (let i = 0; i < colsPerRow; i++) {
      colsData.current.cols[i] = {
        left: i * (colWidth + gap) + gutter,
      }
    }
  }, [cells, gap, gutter])

  /**
   * Caches the amount of rows that will be computed.
   */
  const cacheRows = useCallback(() => {
    const { amount } = cells

    const rowsAmount = Math.ceil(amount / colsData.current.maxPerRow)

    rowsData.current = {
      amount: rowsAmount,
      rows: {},
    }

    for (let i = 0; i < rowsAmount; i++) {
      rowsData.current.rows[i] = {
        index: i,
        top: i * (cells.height + gap) + gutter,
      }
    }
  }, [cells, gap, gutter])

  /**
   * Caches the height of the wrapper.
   */
  const cacheWrapperHeight = useCallback(() => {
    const root = rootRef.current

    if (!root) {
      console.error(`[Virtualform] The root element is not mounted yet.`)

      return 0
    }

    wrapperHeight.current =
      rowsData.current.amount * cells.height +
      gap * (rowsData.current.amount - 1) +
      gutter * 2
  }, [cells.height, gap, gutter])

  const cacheMountedRows = useCallback(() => {
    const root = rootRef.current

    if (!root) {
      console.error(`[Virtualform] The root element is not mounted yet.`)

      return 0
    }

    const { scrollTop, clientHeight } = root

    const start = Math.max(
      0,
      Math.floor(scrollTop / (cells.height + gap)) - overscan
    )

    const end = Math.min(
      rowsData.current.amount,
      Math.ceil((scrollTop + clientHeight) / (cells.height + gap)) + overscan
    )

    mountedRowsIndices.current = []

    for (let i = start; i < end; i++) {
      mountedRowsIndices.current.push(i)
    }
  }, [cells.height, gap, overscan])

  /**
   * Caches the row and col index for each cell.
   */
  const cacheCells = useCallback(() => {
    const { amount } = cells

    computedRowCells.current = []

    for (let i = 0; i < amount; i++) {
      const rowIndex = Math.floor(i / colsData.current.maxPerRow)
      const colIndex = i % colsData.current.maxPerRow

      const row = rowsData.current.rows[rowIndex] as IRow
      const col = colsData.current.cols[colIndex] as ICol

      if (!computedRowCells.current[rowIndex]) {
        computedRowCells.current[rowIndex] = []
      }

      computedRowCells.current[rowIndex].push({
        index: i,

        getProps() {
          return {
            key: i,

            style: {
              position: 'absolute',
              width: colsData.current.width,
              height: cells.height,
              transform: `translate(${col.left}px, ${row.top}px)`,
            },
          }
        },
      })
    }
  }, [cells])

  function recompute() {
    cacheAvailableWidth()
    cacheCols()
    cacheRows()
    cacheWrapperHeight()
    cacheMountedRows()
    cacheCells()

    setChecksum((prev) => prev + 1)
  }

  function getMountedCells() {
    return computedRowCells.current
      .slice(
        mountedRowsIndices.current[0],
        mountedRowsIndices.current[mountedRowsIndices.current.length - 1] + 1
      )
      .flat()
  }

  useLayoutEffect(recompute, [])

  useEffect(recompute, [cells.amount, gutter, gap, overscan])

  useEventListener(
    'scroll',
    () => {
      cacheMountedRows()

      setChecksum((prev) => prev + 1)
    },
    rootRef
  )

  useEventListener('resize', recompute)

  return {
    /**
     * A function that returns the props needed at the
     * root div element.
     *
     * The root di must have the wrapper div inside of it.
     *
     * @returns The needed props for the root element.
     */
    getRootProps() {
      return {
        ref: rootRef,

        style: {
          position: 'relative',
          overflowY: 'auto',
        } as CSSProperties,
      }
    },

    /**
     * A function that returns the props needed at the
     * wrapper div element.
     *
     * The wrapper div element must be placed inside the root div.
     *
     * @returns The needed props for the wrapper element.
     */
    getWrapperProps() {
      return {
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: wrapperHeight.current,
        } as CSSProperties,
      }
    },

    /**
     * The virtualized cells of the grid. The items in this array
     * are the cells that are currently mounted in the DOM.
     *
     * You may have more or less items in this array depending
     * on the overscan value.
     */
    cells: getMountedCells(),

    /**
     * An array of the indices of the rows that are currently mounted.
     */
    mountedRowsIndices: mountedRowsIndices.current,

    /**
     * The absolute amount of rows that are in the grid, regardless
     * whether they are mounted or not.
     */
    rowsAmount: rowsData.current.amount,
  }
}

type IInput = {
  cells: {
    /**
     * The total number of cells in the grid.
     *
     * This is necessary so Virtualform can calculate the number of rows
     * and reserve enough space for them.
     *
     * @example 100
     */
    amount: number

    /**
     * The width of each cell. This is an estimation, as the actual width
     * of each cell will be calculated based on the available width of the grid.
     *
     * @example 100
     */
    width: number

    /**
     * The height of each row. Each and every cell will have its height
     * as the same as the height of the row.
     *
     * @example 100
     */
    height: number
  }

  /**
   * The amount of space between each cell, vertically and horizontally.
   * This won't create breathing space around the grid. If you want that,
   * use the `gutter` property.
   *
   * @default 0
   * @example 10
   */
  gap?: number

  /**
   * The amount of whitespace around the grid.
   *
   * @default 0
   * @example 50
   */
  gutter?: number

  /**
   * The amount of rows that will be mounted even when not visible to the user.
   * This is useful to give a smoother experience while scrolling.
   *
   * Don't exaggerate with this number, though. The more overscan rows you have,
   * the more expensive it will be to render the grid, thus making the scrolling
   * experience worse.
   *
   * While developing, it's recommended to start with 0 and increase gradually
   * until you find the right number that gives the best experience.
   */
  overscan?: number
}

/**
 * A computed cell with all the necessary information to render it.
 */
type IComputedCell = {
  /**
   * The index of the cell.
   */
  index: number

  /**
   * @returns The props that should be passed to the wrapping div of the cell.
   */
  getProps: () => {
    key: string | number
    style: Pick<CSSProperties, 'position' | 'width' | 'height' | 'transform'>
  }
}

type IRowsData = {
  /**
   * The amount of rows in the grid.
   */
  amount: number

  /**
   * The rows in the grid.
   */
  rows: Record<number, IRow>
}

type IRow = {
  /**
   * The index of the row.
   */
  index: number

  /**
   * The absolute top position of the row, in pixels.
   */
  top: number
}

type ICol = {
  /**
   * The absolute left position of the column, in pixels.
   */
  left: number
}

type IColsData = {
  /**
   * The width of each column.
   */
  width: number

  /**
   * The maximum amount of columns a row can have.
   */
  maxPerRow: number

  /**
   * The cached columns.
   */
  cols: Record<number, { left: number }>
}

type Index = number
