import { useCallback, useEffect, useRef, useState } from 'react'

import { useEventListener } from './use-event-listener'

export function useGrid(input: IInput) {
  const { cells, gap = 0, gutter = 0 } = input

  const parentRef = useRef<HTMLDivElement>(null)

  const rowsAmount = useRef(0)
  const colsPerRow = useRef(0)
  const colWidthRef = useRef(0)
  const visibleRows = useRef<number[]>([])

  const [visibleCells, setVisibleCells] = useState<ICell[]>([])

  const computeVisibleCells = useCallback(() => {
    if (
      rowsAmount.current === Infinity ||
      rowsAmount.current === 0 ||
      !parentRef.current
    ) {
      return
    }

    visibleRows.current = []
    const nextVisibleCells: ICell[] = []

    let rowIndex = rowsAmount.current

    while (rowIndex--) {
      const rowTop = calcRowTop(rowIndex, cells.height, gap, gutter)

      if (isRowVisible(rowTop, cells.height, parentRef.current)) {
        visibleRows.current = [...visibleRows.current, rowIndex]

        let colsAtRow =
          rowIndex === rowsAmount.current - 1
            ? cells.amount % colsPerRow.current
            : colsPerRow.current

        while (colsAtRow--) {
          const cellIndex = rowIndex * colsPerRow.current + colsAtRow

          const colLeft = calcColLeft(
            colsAtRow,
            colWidthRef.current,
            gap,
            gutter
          )

          nextVisibleCells.push({
            index: cellIndex,

            getProps() {
              return {
                key: cellIndex.toString(),

                style: {
                  position: 'absolute',
                  width: colWidthRef.current,
                  height: cells.height,
                  transform: `translate(${colLeft}px, ${rowTop}px)`,
                },
              }
            },
          })
        }
      }
    }

    setVisibleCells(nextVisibleCells)
  }, [gap, gutter, cells.height, cells.amount])

  const recompute = useCallback(() => {
    // Recalculate the available width.
    const nextAvailableWidth = calcAvailableWidth(parentRef, gutter)

    const [_colsPerRow, colWidth] = calcColsPerRow(
      nextAvailableWidth,
      cells.width,
      gap
    )

    // Recompute the width of a single row.
    colWidthRef.current = colWidth

    // Recompute the number of columns that can fit in a single row of the grid.
    colsPerRow.current = _colsPerRow

    // Recompute the number of rows that can fit in the grid.
    rowsAmount.current = calcRowsAmount(colsPerRow.current, cells.amount)

    computeVisibleCells()
  }, [gap, gutter, cells, computeVisibleCells])

  const getParentProps = useCallback(() => {
    return {
      ref: parentRef,

      style: {
        position: 'relative',
        overflowY: 'auto',
      } as React.CSSProperties,
    }
  }, [])

  const getWrapperProps = useCallback(() => {
    const height = calcGridHeight(rowsAmount.current, cells.height, gap, gutter)

    if (isNaN(height) || !isFinite(height) || height < 0) {
      return
    }

    return {
      style: {
        width: '100%',
        position: 'relative',
        height,
      } as React.CSSProperties,
    }
  }, [gap, gutter, cells.height])

  /**
   * Recompute on mount
   */
  useEffect(() => {
    let isAvailable = false

    while (!isAvailable) {
      if (parentRef.current) {
        isAvailable = true

        break
      }
    }

    if (isAvailable) {
      recompute()
    }
  }, [])

  useEffect(recompute, [cells.amount, gap, gutter])

  useEffect(computeVisibleCells, [
    gap,
    gutter,
    cells.height,
    computeVisibleCells,
  ])

  /**
   * Calc visible rows.
   */
  useEventListener('scroll', computeVisibleCells, parentRef)

  useEventListener('resize', recompute)

  return {
    /**
     * A function that returns an object with the necessary props for the
     * firstmost parent of the virtualized grid.
     *
     * The wrapper goes inside the parent element.
     */
    getParentProps,

    /**
     * A function that returns an object with the necessary props for the
     * wrapper element to render properly.
     *
     * The element spreading these props must be within the parent element
     * (the one spreading the props returned by `getParentProps`).
     */
    getWrapperProps,

    /**
     * The visible cells.
     */
    cells: visibleCells,

    /**
     * An array containing the visible rows.
     * Useful to build your own sensors.
     */
    visibleRows: visibleRows.current,

    /**
     * A function that recomputes the grid and the positions
     * of the cells.
     *
     * You usually want to call this function when you want your virtualized grid
     * to re-render after a change in the number of cells, the gap, the gutter, etc.
     *
     * This is quite an expensive task, so use it wisely.
     */
    recompute,

    /**
     * The current number of rows in the grid, regardless of whether they
     * are visible or not.
     */
    get rowsAmount() {
      return rowsAmount.current
    },

    /**
     * The current number of columns per row in the grid.
     */
    get colsPerRow() {
      return colsPerRow.current
    },

    /**
     * The current width of each column/cell.
     */
    get colWidth() {
      return colWidthRef.current
    },
  }
}

function calcAvailableWidth(
  parentRef: React.RefObject<HTMLDivElement>,
  gutter = 0
) {
  if (!parentRef.current) {
    return 0
  }

  const { width } = parentRef.current.getBoundingClientRect()

  return width - gutter
}

/**
 * Returns the number of columns that can fit in the grid.
 *
 * @param availableWidth The available width of the grid.
 * @param minMax The minimum and maximum width of each column.
 * @param gap The gap between each column.
 *
 * @returns A tuple of the number of columns that can fit in the grid and the width of each column.
 */
function calcColsPerRow(
  availableWidth: number,
  minmax: [number, number],
  gap = 0
) {
  const [min, max] = minmax

  const colsPerRow = Math.floor(availableWidth / (max + gap))

  const colWidth = (availableWidth - gap * (colsPerRow - 1)) / colsPerRow

  return [colsPerRow, colWidth]
}

/**
 * Returns the number of rows that can fit in the grid.
 *
 * @param colsPerRow The number of columns that can fit in the grid.
 * @param totalCells The total number of cells.
 *
 * @returns
 */
function calcRowsAmount(colsPerRow: number, totalCells: number) {
  return Math.ceil(totalCells / colsPerRow)
}

function calcRowTop(rowIndex: number, rowHeight: number, gap = 0, gutter = 0) {
  return rowIndex * (rowHeight + gap) + gutter / 2
}

/**
 * Returns the left position of a column in the grid.
 *
 * @param colIndex
 * @param colWidth
 * @param gap
 * @returns
 */
function calcColLeft(colIndex: number, colWidth: number, gap = 0, gutter = 0) {
  return colIndex * (colWidth + gap) + gutter / 2
}

/**
 * Returns the height (in pixels) of the grid.
 *
 * @param rowsAmount The total number of rows.
 * @param gap The gap between each row.
 * @returns
 */
function calcGridHeight(
  rowsAmount: number,
  rowsHeight: number,
  gap = 0,
  gutter = 0
) {
  return rowsAmount * (rowsHeight + gap) - gap + gutter
}

/**
 * Returns a filtered array of rows that are visible in the grid.
 */
function isRowVisible(
  rowTop: number,
  rowsHeight: number,
  parentElement: Element
) {
  const top = rowTop
  const bottom = top + rowsHeight

  const parentTop = parentElement.scrollTop
  const parentBottom = parentTop + parentElement.clientHeight

  return bottom > parentTop && top < parentBottom
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
     * A tuple containing, respectively, the minimum and maximum width of each column.
     * Useful for responsiveness and behaves similar to CSS Grid.
     *
     * A column won't ever be greater than the maximum size and won't ever be smaller
     * than the minimum size.
     *
     * If the two numbers are the same, Virtualform will do its best to be as accurate
     * as possible.
     *
     * @example [100, 100]
     */
    width: [number, number]

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
}

type ICell = {
  index: number
  getProps: () => { key: string; style: React.CSSProperties }
}
